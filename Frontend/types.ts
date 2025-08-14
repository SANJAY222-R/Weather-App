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
// This defines the shape of a single item in the forecast list
export interface ForecastItem {
  dt: number;
  main: {
    temp_max: number;
    temp_min: number;
  };
  weather: {
    icon: string;
  }[];
}