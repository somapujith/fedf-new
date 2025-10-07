import { Card } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Thermometer } from "lucide-react";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

interface WeatherCardProps {
  data: WeatherData;
}

export const WeatherCard = ({ data }: WeatherCardProps) => {
  const weatherIcon = data.weather[0].icon;
  const weatherMain = data.weather[0].main;
  const weatherDesc = data.weather[0].description;
  
  return (
  <Card className="w-full max-w-2xl p-8 bg-card shadow-[var(--shadow-card)] border-0">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4">
          <h2 className="text-4xl font-bold text-foreground">{data.name}</h2>
        </div>
        
        <div className="flex items-center justify-center gap-6">
          <div className="w-32 h-32 flex items-center justify-center">
            <img 
              src={`https://openweathermap.org/img/wn/${weatherIcon}@4x.png`}
              alt={weatherDesc}
              className="w-full h-full"
            />
          </div>
          <div className="text-left">
            <div className="text-6xl font-bold text-foreground">
              {Math.round(data.main.temp)}°C
            </div>
            <div className="text-xl text-muted-foreground capitalize mt-2">
              {weatherDesc}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border">
          <div className="flex flex-col items-center gap-2 p-4 bg-secondary/30 rounded-lg">
            <Thermometer className="w-6 h-6 text-accent-foreground" />
            <div className="text-sm text-muted-foreground">Feels Like</div>
            <div className="text-xl font-semibold text-foreground">
              {Math.round(data.main.feels_like)}°C
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 bg-secondary/30 rounded-lg">
            <Droplets className="w-6 h-6 text-accent-foreground" />
            <div className="text-sm text-muted-foreground">Humidity</div>
            <div className="text-xl font-semibold text-foreground">
              {data.main.humidity}%
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 bg-secondary/30 rounded-lg">
            <Wind className="w-6 h-6 text-accent-foreground" />
            <div className="text-sm text-muted-foreground">Wind Speed</div>
            <div className="text-xl font-semibold text-foreground">
              {Math.round(data.wind.speed * 3.6)} km/h
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 bg-secondary/30 rounded-lg">
            <Cloud className="w-6 h-6 text-accent-foreground" />
            <div className="text-sm text-muted-foreground">Pressure</div>
            <div className="text-xl font-semibold text-foreground">
              {data.main.pressure} hPa
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
