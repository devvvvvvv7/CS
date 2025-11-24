import { useState, useEffect } from 'react';
import { ref, onValue, set, get } from 'firebase/database';
import { database, ROOT_PATH } from '@/lib/firebase';
import { SensorData, Schedule, IrrigationLog } from '@/types/agrisense';
import { SensorCard } from '@/components/SensorCard';
import { PumpControl } from '@/components/PumpControl';
import { ScheduleManager } from '@/components/ScheduleManager';
import { SensorChart } from '@/components/SensorChart';
import { IrrigationHistory } from '@/components/IrrigationHistory';
import { AIAssistant } from '@/components/AIAssistant';
import { WeatherForecast } from '@/components/WeatherForecast';
import { IrrigationAdvice } from '@/components/IrrigationAdvice';
import { Thermometer, Droplets, Sun, CloudRain, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [sensorData, setSensorData] = useState<SensorData>({});
  const [schedule, setSchedule] = useState<Schedule>();
  const [chartData, setChartData] = useState<any[]>([]);
  const [irrigationLogs, setIrrigationLogs] = useState<IrrigationLog[]>([]);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const { toast } = useToast();

  // Listen to sensor data
  useEffect(() => {
    const dataRef = ref(database, `${ROOT_PATH}/data`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensorData(data);
        
        // Update chart data (keep last 20 points)
        const now = new Date();
        const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
        setChartData((prev) => {
          const newData = [
            ...prev,
            {
              time: timeStr,
              temperature: data.temperature,
              humidity: data.humidity,
              soil: data.soil_percent,
            },
          ];
          return newData.slice(-20);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to schedule
  useEffect(() => {
    const scheduleRef = ref(database, `${ROOT_PATH}/schedule`);
    const unsubscribe = onValue(scheduleRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSchedule(data);
      }
    });

    return () => unsubscribe();
  }, []);

  // Force change helper for relay
  const setRelayForce = async (state: 'ON' | 'OFF') => {
    const relayRef = ref(database, `${ROOT_PATH}/relay`);
    try {
      const snapshot = await get(relayRef);
      const current = snapshot.val();
      const curStr = current === 'ON' || current === true ? 'ON' : 'OFF';
      
      if (curStr === state) {
        // Force flip
        const alt = state === 'ON' ? 'OFF' : 'ON';
        await set(relayRef, alt);
        await new Promise(resolve => setTimeout(resolve, 180));
      }
      await set(relayRef, state);
      
      // Log the action
      const now = new Date();
      const logEntry: IrrigationLog = {
        id: `${Date.now()}`,
        timestamp: now.toLocaleString(),
        action: state,
        mode: sensorData.autoControl ? 'auto' : 'manual',
      };
      setIrrigationLogs(prev => [logEntry, ...prev].slice(0, 50));
    } catch (error) {
      console.error('Relay set error:', error);
      toast({
        title: "Error",
        description: "Failed to control pump",
        variant: "destructive",
      });
    }
  };

  const handlePumpOn = () => setRelayForce('ON');
  const handlePumpOff = () => setRelayForce('OFF');

  const handleSetTimer = async (seconds: number) => {
    try {
      await set(ref(database, `${ROOT_PATH}/timer_seconds`), seconds);
      const now = new Date();
      await set(ref(database, `${ROOT_PATH}/last_timer`), {
        seconds,
        ts: now.toLocaleString(),
      });
      await setRelayForce('ON');
      
      const logEntry: IrrigationLog = {
        id: `${Date.now()}`,
        timestamp: now.toLocaleString(),
        action: 'TIMER',
        duration: seconds,
        mode: 'manual',
      };
      setIrrigationLogs(prev => [logEntry, ...prev].slice(0, 50));
    } catch (error) {
      console.error('Timer set error:', error);
    }
  };

  const handleAutoControlToggle = async (enabled: boolean) => {
    try {
      await set(ref(database, `${ROOT_PATH}/autoControl`), enabled);
      toast({
        title: enabled ? "Auto Control Enabled" : "Auto Control Disabled",
        description: enabled 
          ? "System will follow the schedule automatically" 
          : "Manual control is now active",
      });
    } catch (error) {
      console.error('Auto control toggle error:', error);
    }
  };

  const handleUpdateSchedule = async (newSchedule: Schedule) => {
    try {
      await set(ref(database, `${ROOT_PATH}/schedule`), newSchedule);
    } catch (error) {
      console.error('Schedule update error:', error);
      toast({
        title: "Error",
        description: "Failed to update schedule",
        variant: "destructive",
      });
    }
  };

  const handleLoadSchedule = async () => {
    try {
      const snapshot = await get(ref(database, `${ROOT_PATH}/schedule`));
      if (snapshot.exists()) {
        setSchedule(snapshot.val());
        toast({
          title: "Schedule Loaded",
          description: "Current schedule loaded into form",
        });
      }
    } catch (error) {
      console.error('Schedule load error:', error);
    }
  };

  const getSoilStatus = () => {
    const soil = sensorData.soil_percent;
    if (soil === undefined) return 'normal';
    if (soil < 30) return 'critical';
    if (soil < 50) return 'warning';
    return 'normal';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-success text-primary-foreground py-6 px-4 sm:px-6 lg:px-8 shadow-large"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Sprout className="w-8 h-8" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Agrisense</h1>
              <p className="text-sm opacity-90">Smart Farming Dashboard</p>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Irrigation AI Advice */}
            <IrrigationAdvice sensorData={sensorData} weatherForecast={weatherData} />

            {/* Sensor Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SensorCard
              title="Temperature"
              value={sensorData.temperature ?? '--'}
              unit="°C"
              subtitle={`Humidity: ${sensorData.humidity ?? '--'}%`}
              icon={Thermometer}
              status={
                sensorData.temperature 
                  ? sensorData.temperature > 35 ? 'warning' : 'normal'
                  : 'normal'
              }
            />
            <SensorCard
              title="Soil Moisture"
              value={sensorData.soil_percent ?? '--'}
              unit="%"
              subtitle={`Raw: ${sensorData.soil_raw ?? '--'}`}
              icon={Droplets}
              status={getSoilStatus()}
            />
            <SensorCard
              title="Light Level"
              value={sensorData.ldr_percent ?? '--'}
              unit="%"
              icon={Sun}
            />
            <SensorCard
              title="Rain Status"
              value={sensorData.rain ?? '--'}
              icon={CloudRain}
            />
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <SensorChart
              data={chartData}
              title="Environmental Trends"
            />
          )}

          {/* Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PumpControl
                relayState={sensorData.relay_state || 'OFF'}
                autoControl={sensorData.autoControl || false}
                onPumpOn={handlePumpOn}
                onPumpOff={handlePumpOff}
                onSetTimer={handleSetTimer}
                onAutoControlToggle={handleAutoControlToggle}
              />
            </div>
            <ScheduleManager
              schedule={schedule}
              onUpdateSchedule={handleUpdateSchedule}
              onLoadSchedule={handleLoadSchedule}
            />
          </div>

            {/* History */}
            <IrrigationHistory logs={irrigationLogs} />
          </TabsContent>

          <TabsContent value="ai-assistant" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AIAssistant sensorData={sensorData} weatherData={weatherData} />
              </div>
              <div>
                <WeatherForecast />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weather" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherForecast />
              <IrrigationAdvice sensorData={sensorData} weatherForecast={weatherData} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
