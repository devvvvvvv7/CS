import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudRain, Droplets, Wind, AlertCircle } from 'lucide-react';
import { get5DayForecast, WeatherData } from '@/lib/weather';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const WeatherForecast = () => {
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await get5DayForecast();
        setForecast(data);
        setError(null);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Failed to load weather forecast. Please check your API key.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 3600000); // Update every hour
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="border-border/40 shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="w-5 h-5" />
            5-Day Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-border/40 shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="w-5 h-5" />
            5-Day Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40 shadow-elegant bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-primary" />
          5-Day Weather Forecast
        </CardTitle>
        <CardDescription>Plan your irrigation schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {forecast.map((day, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/30 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  className="w-12 h-12"
                />
                <div>
                  <p className="font-semibold text-sm">{day.date}</p>
                  <p className="text-xs text-muted-foreground capitalize">{day.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Wind className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{day.temp}°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <Droplets className="w-4 h-4 text-water" />
                  <span>{day.humidity}%</span>
                </div>
                {day.rainfall > 0 && (
                  <div className="flex items-center gap-1 text-water">
                    <CloudRain className="w-4 h-4" />
                    <span>{day.rainfall}mm</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
