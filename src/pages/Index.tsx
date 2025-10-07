import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { WeatherCard } from "@/components/WeatherCard";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

const Index = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchWeather = async () => {
    if (!city.trim()) {
      toast({
        title: "Please enter a city name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // First, get coordinates for the city using geocoding
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      
      if (!geoResponse.ok) {
        throw new Error("City not found");
      }

      const geoData = await geoResponse.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found");
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      
      // Then get weather data using coordinates
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,pressure_msl&timezone=Asia/Kolkata`
      );

      if (!weatherResponse.ok) {
        throw new Error("Weather data unavailable");
      }

      const weatherData = await weatherResponse.json();
      
      // Transform data to match our WeatherCard component structure
      const transformedData = {
        name: name,
        main: {
          temp: weatherData.current.temperature_2m,
          feels_like: weatherData.current.apparent_temperature,
          humidity: weatherData.current.relative_humidity_2m,
          pressure: weatherData.current.pressure_msl,
        },
        weather: [{
          main: getWeatherDescription(weatherData.current.weather_code),
          description: getWeatherDescription(weatherData.current.weather_code),
          icon: getWeatherIcon(weatherData.current.weather_code),
        }],
        wind: {
          speed: weatherData.current.wind_speed_10m,
        },
      };

      setWeatherData(transformedData);
      toast({
        title: "Weather data loaded!",
        description: `Showing weather for ${name}, ${country}`,
      });
    } catch (error) {
      toast({
        title: "Error fetching weather",
        description: "Please check the city name and try again.",
        variant: "destructive",
      });
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Convert WMO weather codes to descriptions
  const getWeatherDescription = (code: number): string => {
    const weatherCodes: { [key: number]: string } = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    return weatherCodes[code] || "Unknown";
  };

  // Convert WMO weather codes to icon codes
  const getWeatherIcon = (code: number): string => {
    if (code === 0) return "01d";
    if (code === 1) return "02d";
    if (code === 2 || code === 3) return "03d";
    if (code === 45 || code === 48) return "50d";
    if (code >= 51 && code <= 55) return "09d";
    if (code >= 61 && code <= 65) return "10d";
    if (code >= 71 && code <= 77) return "13d";
    if (code >= 80 && code <= 82) return "09d";
    if (code >= 85 && code <= 86) return "13d";
    if (code >= 95) return "11d";
    return "01d";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchWeather();
    }
  };

  return (
    <main className="min-h-screen bg-[image:var(--gradient-sky)] flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4 animate-in fade-in-50 slide-in-from-top-4 duration-700">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground drop-shadow-sm">
            Weather Finder
          </h1>
          <p className="text-lg text-foreground/80">
            Get real-time weather information for cities across India
          </p>
        </div>

        <Card className="p-6 bg-card shadow-[var(--shadow-card)] border-0 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-150">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 h-12 text-lg bg-input border-border focus:ring-2 focus:ring-ring"
              disabled={loading}
            />
            <Button
              onClick={fetchWeather}
              disabled={loading}
              className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-semibold"
            >
              <Search className="w-5 h-5 mr-2" />
              {loading ? "Searching..." : "Get Weather"}
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Try cities like: Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad
          </div>
        </Card>

        {weatherData && (
          <div className="animate-in fade-in-50 slide-in-from-bottom-8 duration-500">
            <WeatherCard data={weatherData} />
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-foreground/60 text-sm">
        <p>Weather data powered by Open-Meteo</p>
      </footer>
    </main>
  );
};

export default Index;
