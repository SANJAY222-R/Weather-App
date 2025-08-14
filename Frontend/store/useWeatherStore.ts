import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WeatherData, ForecastItem } from "@/types";

// Ensure this IP address is correct for your development machine.
const API_URL = "http://172.20.198.178:3000/api";

interface WeatherState {
  currentCity: string;
  weatherData: WeatherData | null;
  forecastData: ForecastItem[];
  loading: boolean;
  error: string | null;
  favoriteCities: string[];
  fetchDataForCity: (city: string) => Promise<void>;
  fetchDataByCoords: (lat: number, lon: number) => Promise<void>;
  setCurrentCity: (city: string) => void;
  addFavoriteCity: (city: string) => void;
  removeFavoriteCity: (city: string) => void;
  setError: (error: string | null) => void;
  // ✅ ADDED: Function signature for validation
  validateCity: (city: string) => Promise<boolean>;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      currentCity: "",
      weatherData: null,
      forecastData: [],
      loading: false,
      error: null,
      favoriteCities: [],

      setError: (error: string | null) => set({ error, loading: false }),

      fetchDataForCity: async (city: string) => {
        set({ loading: true, error: null });
        try {
          const [weatherRes, forecastRes] = await Promise.all([
            fetch(`${API_URL}/weather/${city}`),
            fetch(`${API_URL}/forecast/${city}`),
          ]);

          if (!weatherRes.ok) throw new Error("City not found. Please try another.");
          if (!forecastRes.ok) throw new Error("Could not fetch forecast data.");

          const weatherData = await weatherRes.json();
          const forecastData = await forecastRes.json();

          set({
            weatherData,
            forecastData,
            currentCity: weatherData.name,
            loading: false,
          });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },

      fetchDataByCoords: async (lat: number, lon: number) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/weather/by-coords?lat=${lat}&lon=${lon}`);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Could not fetch data for your location." }));
            throw new Error(errorData.message);
          }

          const combinedData = await response.json();

          set({
            weatherData: combinedData.weather,
            forecastData: combinedData.forecast,
            currentCity: combinedData.city,
            loading: false,
          });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },

      setCurrentCity: (city: string) => {
        get().fetchDataForCity(city);
      },

      addFavoriteCity: (city: string) =>
        set((state) => ({
          favoriteCities: [...new Set([city, ...state.favoriteCities])],
        })),

      removeFavoriteCity: (city: string) =>
        set((state) => ({
          favoriteCities: state.favoriteCities.filter((c) => c !== city),
        })),

      // ✅ ADDED: Function implementation for validation
      validateCity: async (city: string): Promise<boolean> => {
        try {
          // We just need to check if the endpoint returns a successful response.
          // We don't need the data, so this is an efficient way to validate.
          const response = await fetch(`${API_URL}/weather/${city}`);
          // 'response.ok' is true if the HTTP status is 200-299.
          return response.ok;
        } catch (error) {
          // If the fetch fails (e.g., network error), the city is not valid.
          console.error("Validation fetch error:", error);
          return false;
        }
      },
    }),
    {
      name: "weather-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);