import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Power, Timer, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface PumpControlProps {
  relayState: string;
  autoControl: boolean;
  onPumpOn: () => void;
  onPumpOff: () => void;
  onSetTimer: (seconds: number) => void;
  onAutoControlToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

export const PumpControl = ({
  relayState,
  autoControl,
  onPumpOn,
  onPumpOff,
  onSetTimer,
  onAutoControlToggle,
  disabled = false,
}: PumpControlProps) => {
  const [timerSeconds, setTimerSeconds] = useState<string>('');
  const { toast } = useToast();

  const handleTimerSubmit = () => {
    const seconds = parseInt(timerSeconds);
    if (!seconds || seconds <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number of seconds",
        variant: "destructive",
      });
      return;
    }
    onSetTimer(seconds);
    setTimerSeconds('');
    toast({
      title: "Timer Started",
      description: `Pump will run for ${seconds} seconds`,
    });
  };

  const isPumpOn = relayState === 'ON';
  const manualDisabled = disabled || autoControl;

  return (
    <Card className="p-6 shadow-medium">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Pump Control</h3>
            <p className="text-sm text-muted-foreground">
              Manage irrigation system manually or automatically
            </p>
          </div>
          <motion.div
            animate={{
              scale: isPumpOn ? [1, 1.1, 1] : 1,
            }}
            transition={{
              repeat: isPumpOn ? Infinity : 0,
              duration: 2,
            }}
          >
            <Power
              className={`w-8 h-8 ${
                isPumpOn ? 'text-success' : 'text-muted-foreground'
              }`}
            />
          </motion.div>
        </div>

        {/* Auto Control Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-info" />
            <Label htmlFor="auto-control" className="text-sm font-medium">
              Auto Control Mode
            </Label>
          </div>
          <Switch
            id="auto-control"
            checked={autoControl}
            onCheckedChange={onAutoControlToggle}
            disabled={disabled}
          />
        </div>

        {autoControl && (
          <div className="p-3 bg-info/10 border border-info/20 rounded-lg text-sm text-info">
            Auto control is enabled. Manual controls are disabled. The system follows the schedule.
          </div>
        )}

        {/* Manual Controls */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <Button
              onClick={onPumpOn}
              disabled={manualDisabled}
              className="flex-1 bg-gradient-to-r from-success to-primary"
              size="lg"
            >
              <Power className="w-4 h-4 mr-2" />
              Turn ON
            </Button>
            <Button
              onClick={onPumpOff}
              disabled={manualDisabled}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <Power className="w-4 h-4 mr-2" />
              Turn OFF
            </Button>
          </div>

          {/* Timer Control */}
          <div className="space-y-2">
            <Label htmlFor="timer-input" className="text-sm">
              Start Timer (seconds)
            </Label>
            <div className="flex gap-2">
              <Input
                id="timer-input"
                type="number"
                min="1"
                placeholder="e.g., 60"
                value={timerSeconds}
                onChange={(e) => setTimerSeconds(e.target.value)}
                disabled={manualDisabled}
              />
              <Button
                onClick={handleTimerSubmit}
                disabled={manualDisabled}
                variant="secondary"
              >
                <Timer className="w-4 h-4 mr-2" />
                Start
              </Button>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm text-muted-foreground">Current Status:</span>
          <span className={`font-semibold ${isPumpOn ? 'text-success' : 'text-muted-foreground'}`}>
            {relayState || 'Unknown'}
          </span>
        </div>
      </div>
    </Card>
  );
};
