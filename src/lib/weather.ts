// OpenWeatherMap API for 5-day forecast
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  date: string;
  temp: number;
  humidity: number;
  description: string;
  icon: string;
  rainfall: number;
}

export const get5DayForecast = async (lat: number = 28.6139, lon: number = 77.2090): Promise<WeatherData[]> => {
  if (!WEATHER_API_KEY) {
    throw new Error('Weather API key not configured');
  }

  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();
  
  // Group by day and take one forecast per day (12:00 PM)
  const dailyForecasts: WeatherData[] = [];
  const seenDates = new Set<string>();

  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const dateStr = date.toLocaleDateString();
    
    if (!seenDates.has(dateStr) && dailyForecasts.length < 5) {
      seenDates.add(dateStr);
      dailyForecasts.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        temp: Math.round(item.main.temp),
        humidity: item.main.humidity,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        rainfall: item.rain?.['3h'] || 0,
      });
    }
  });

  return dailyForecasts;
};
