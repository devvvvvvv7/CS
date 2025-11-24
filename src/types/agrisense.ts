export interface SensorData {
  temperature?: number;
  humidity?: number;
  soil_percent?: number;
  soil_raw?: number;
  ldr_percent?: number;
  rain?: string;
  relay_state?: string;
  autoControl?: boolean;
}

export interface Schedule {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  enabled: boolean;
}

export interface IrrigationLog {
  id: string;
  timestamp: string;
  action: 'ON' | 'OFF' | 'TIMER';
  duration?: number;
  mode: 'manual' | 'auto' | 'scheduled';
}

export interface Alert {
  id: string;
  type: 'temperature' | 'humidity' | 'soil' | 'system';
  severity: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  active: boolean;
}
