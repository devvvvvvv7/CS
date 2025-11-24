import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface DataPoint {
  time: string;
  temperature?: number;
  humidity?: number;
  soil?: number;
}

interface SensorChartProps {
  data: DataPoint[];
  title: string;
}

export const SensorChart = ({ data, title }: SensorChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-6 shadow-medium">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            {data[0]?.temperature !== undefined && (
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={false}
                name="Temperature (°C)"
              />
            )}
            {data[0]?.humidity !== undefined && (
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="hsl(var(--info))"
                strokeWidth={2}
                dot={false}
                name="Humidity (%)"
              />
            )}
            {data[0]?.soil !== undefined && (
              <Line
                type="monotone"
                dataKey="soil"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                dot={false}
                name="Soil Moisture (%)"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
};
