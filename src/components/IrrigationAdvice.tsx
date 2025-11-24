import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SensorData } from '@/types/agrisense';
import { motion } from 'framer-motion';

interface IrrigationAdviceProps {
  sensorData: SensorData;
  weatherForecast?: any[];
}

export const IrrigationAdvice = ({ sensorData, weatherForecast }: IrrigationAdviceProps) => {
  const getAdvice = () => {
    const soil = sensorData.soil_percent || 0;
    const temp = sensorData.temperature || 0;
    const humidity = sensorData.humidity || 0;
    const willRain = weatherForecast?.[0]?.rainfall > 0;

    let recommendation = '';
    let status: 'critical' | 'warning' | 'good' = 'good';
    let icon = CheckCircle2;
    let action = '';

    if (soil < 30) {
      status = 'critical';
      icon = AlertTriangle;
      recommendation = 'Immediate irrigation required';
      action = willRain 
        ? 'Start irrigation now but expect rain soon' 
        : 'Start irrigation immediately for 30-45 minutes';
    } else if (soil < 50) {
      status = 'warning';
      icon = TrendingUp;
      recommendation = 'Irrigation recommended soon';
      action = willRain
        ? 'Rain expected - monitor soil levels'
        : 'Schedule irrigation within 2-4 hours';
    } else if (soil >= 70) {
      status = 'good';
      icon = CheckCircle2;
      recommendation = 'Soil moisture optimal';
      action = 'No irrigation needed. Monitor regularly.';
    } else {
      status = 'good';
      icon = CheckCircle2;
      recommendation = 'Soil moisture adequate';
      action = willRain
        ? 'Rain expected - skip irrigation'
        : 'Check again in 6-8 hours';
    }

    // Temperature consideration
    if (temp > 35) {
      action += ' High temperature detected - water early morning or evening.';
    }

    return { recommendation, status, icon: icon, action };
  };

  const advice = getAdvice();
  const Icon = advice.icon;

  const statusColors = {
    critical: 'border-destructive bg-destructive/10 text-destructive',
    warning: 'border-warning bg-warning/10 text-warning',
    good: 'border-success bg-success/10 text-success',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className={`border-2 shadow-elegant ${statusColors[advice.status]}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${advice.status === 'critical' ? 'bg-destructive/20' : advice.status === 'warning' ? 'bg-warning/20' : 'bg-success/20'}`}>
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>AI Irrigation Advice</CardTitle>
                <CardDescription>Based on sensor data & weather forecast</CardDescription>
              </div>
            </div>
            <Badge variant={advice.status === 'critical' ? 'destructive' : 'default'}>
              {advice.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
            <Icon className="w-6 h-6 mt-1 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{advice.recommendation}</h3>
              <p className="text-sm text-muted-foreground">{advice.action}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Soil Moisture</p>
              <div className="flex items-center gap-2">
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      (sensorData.soil_percent || 0) < 30 
                        ? 'bg-destructive' 
                        : (sensorData.soil_percent || 0) < 50 
                        ? 'bg-warning' 
                        : 'bg-success'
                    }`}
                    style={{ width: `${sensorData.soil_percent || 0}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{sensorData.soil_percent || 0}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Temperature</p>
              <div className="flex items-center gap-1">
                {(sensorData.temperature || 0) > 35 ? (
                  <TrendingUp className="w-4 h-4 text-destructive" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-success" />
                )}
                <span className="text-sm font-semibold">{sensorData.temperature || 0}°C</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Humidity</p>
              <div className="flex items-center gap-1">
                <Droplets className="w-4 h-4 text-water" />
                <span className="text-sm font-semibold">{sensorData.humidity || 0}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
