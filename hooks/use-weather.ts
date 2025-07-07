import { useQuery } from '@tanstack/react-query';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Eye } from 'lucide-react';
import React from 'react';

interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

interface MainWeatherData {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  sea_level?: number
  grnd_level?: number
}

interface ForecastItem {
  dt: number
  main: MainWeatherData
  weather: WeatherCondition[]
  clouds: {
    all: number
  }
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  visibility: number
  pop: number
  sys: {
    pod: string
  }
  dt_txt: string
}

interface City {
  id: number
  name: string
  coord: {
    lat: number
    lon: number
  }
  country: string
  population: number
  timezone: number
  sunrise: number
  sunset: number
}

interface WeatherApiResponse {
  cod: string
  message: number
  cnt: number
  list: ForecastItem[]
  city: City
}

interface ProcessedForecastItem {
  dt: number
  dayName: string
  icon: React.ReactElement
  tempMax: number
  tempMin: number
  weather: WeatherCondition[]
  main: MainWeatherData
}

interface CurrentWeather {
  temp: number
  description: string
  icon: React.ReactElement
  humidity: number
  windSpeed: number
  time: string
  feelsLike: number
}

interface WeatherHookReturn {
  cityName: string
  currentWeather: CurrentWeather | null
  dailyForecast: ProcessedForecastItem[]
  isPending: boolean
  isError: boolean
  error: Error | null
  data: WeatherApiResponse | undefined
}

export const useFetchWeather = (city: string = 'Sukabumi,ID'): WeatherHookReturn => {
  const query = useQuery<WeatherApiResponse>({
    queryKey: ['weather', city],
    queryFn: async () => {
      const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!API_KEY) {
        throw new Error('OpenWeatherMap API key is not configured');
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Helper function to get weather icon with more variety
  const getWeatherIcon = (weatherMain: string, isLarge: boolean = false): React.ReactElement => {
    const size = isLarge ? 'w-12 h-12' : 'w-4 h-4';

    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return React.createElement(Sun, { className: `${size} text-yellow-400` });
      case 'rain':
        return React.createElement(CloudRain, { className: `${size} text-blue-400` });
      case 'snow':
        return React.createElement(CloudSnow, { className: `${size} text-blue-200` });
      case 'thunderstorm':
        return React.createElement(CloudLightning, { className: `${size} text-purple-400` });
      case 'mist':
      case 'fog':
        return React.createElement(Eye, { className: `${size} text-gray-400` });
      case 'clouds':
      default:
        return React.createElement(Cloud, { className: `${size} text-gray-300` });
    }
  };

  // Get current weather (first item in the list)
  const getCurrentWeather = (): CurrentWeather | null => {
    if (!query.data?.list || query.data.list.length === 0) return null;

    const currentItem = query.data.list[0];
    const currentTime = new Date(currentItem.dt * 1000);

    return {
      temp: Math.round(currentItem.main.temp),
      description: currentItem.weather[0]?.description || 'Unknown',
      icon: getWeatherIcon(currentItem.weather[0]?.main, true),
      humidity: currentItem.main.humidity,
      windSpeed: Math.round(currentItem.wind.speed * 3.6), // Convert m/s to km/h
      time: currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      feelsLike: Math.round(currentItem.main.feels_like),
    };
  };

  const getDailyForecast = (): ProcessedForecastItem[] => {
    if (!query.data?.list) return [];

    const dailyData: ProcessedForecastItem[] = [];
    const processedDates = new Set<string>();

    // Skip the first item (current weather) and group the rest by day
    for (let i = 1; i < query.data.list.length && dailyData.length < 6; i++) {
      const item = query.data.list[i];
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();

      if (!processedDates.has(dateKey)) {
        processedDates.add(dateKey);

        // Find min/max temps for this day
        const dayForecasts = query.data.list.filter((forecast) => {
          const forecastDate = new Date(forecast.dt * 1000);
          return forecastDate.toDateString() === dateKey;
        });

        const temps = dayForecasts.map(f => f.main.temp);
        const tempMax = Math.max(...temps);
        const tempMin = Math.min(...temps);

        dailyData.push({
          ...item,
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          icon: getWeatherIcon(item.weather[0]?.main),
          tempMax: Math.round(tempMax),
          tempMin: Math.round(tempMin),
        });
      }
    }

    return dailyData;
  };

  return {
    cityName: query.data?.city?.name || 'Sukabumi',
    currentWeather: getCurrentWeather(),
    dailyForecast: getDailyForecast(),
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    data: query.data,
  };
};
