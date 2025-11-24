import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  status?: 'normal' | 'warning' | 'critical';
}

export const SensorCard = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  trend,
  status = 'normal',
}: SensorCardProps) => {
  const statusColors = {
    normal: 'text-success',
    warning: 'text-warning',
    critical: 'text-destructive',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4 sm:p-6 shadow-soft hover:shadow-medium transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-5 h-5 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className={`text-3xl font-bold ${statusColors[status]}`}>
                {value}
              </h3>
              {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {trend && (
            <div className={`ml-2 ${statusColors[status]}`}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trend === 'stable' && '→'}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
