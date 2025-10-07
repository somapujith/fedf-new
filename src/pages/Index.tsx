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

  const API_KEY = "bd5e378503939ddaee76f12ad7a97608"; // Free tier API key for demo

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
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();
      setWeatherData(data);
      toast({
        title: "Weather data loaded!",
        description: `Showing weather for ${data.name}`,
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
        <p>Weather data powered by OpenWeatherMap</p>
      </footer>
    </main>
  );
};

export default Index;
