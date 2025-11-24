import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Save, RefreshCw } from 'lucide-react';
import { Schedule } from '@/types/agrisense';
import { useToast } from '@/hooks/use-toast';

interface ScheduleManagerProps {
  schedule?: Schedule;
  onUpdateSchedule: (schedule: Schedule) => void;
  onLoadSchedule: () => void;
  disabled?: boolean;
}

export const ScheduleManager = ({
  schedule,
  onUpdateSchedule,
  onLoadSchedule,
  disabled = false,
}: ScheduleManagerProps) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (schedule) {
      setStartTime(
        `${String(schedule.startHour).padStart(2, '0')}:${String(schedule.startMinute).padStart(2, '0')}`
      );
      setEndTime(
        `${String(schedule.endHour).padStart(2, '0')}:${String(schedule.endMinute).padStart(2, '0')}`
      );
    }
  }, [schedule]);

  const handleSubmit = () => {
    if (!startTime || !endTime) {
      toast({
        title: "Invalid Schedule",
        description: "Please enter both start and end times",
        variant: "destructive",
      });
      return;
    }

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    onUpdateSchedule({
      startHour,
      startMinute,
      endHour,
      endMinute,
      enabled: true,
    });

    toast({
      title: "Schedule Updated",
      description: `Irrigation scheduled from ${startTime} to ${endTime}`,
    });
  };

  return (
    <Card className="p-6 shadow-medium">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-semibold">Irrigation Schedule</h3>
            <p className="text-sm text-muted-foreground">
              Active when Auto Control is enabled
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={disabled}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Update Schedule
          </Button>
          <Button
            onClick={onLoadSchedule}
            disabled={disabled}
            variant="outline"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {schedule && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Current: {String(schedule.startHour).padStart(2, '0')}:{String(schedule.startMinute).padStart(2, '0')} 
              {' '}-{' '}
              {String(schedule.endHour).padStart(2, '0')}:{String(schedule.endMinute).padStart(2, '0')}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
