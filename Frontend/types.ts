export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  sys: {
    country: string;
  };
}
// --- ADD THIS NEW INTERFACE ---
