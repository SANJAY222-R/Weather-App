import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WeatherData } from "@/types";
import { Alert } from "react-native";

// Ensure this IP address is correct for your development machine.
const API_URL = "http://172.20.198.178:3000/api";

interface WeatherState {
  currentCity: string;
  weatherData: WeatherData | null;
  loading: boolean;
  favoriteCities: string[];
  fetchDataForCity: (city: string) => Promise<void>;
  fetchDataByCoords: (lat: number, lon: number) => Promise<void>;
  setCurrentCity: (city: string) => void;
  addFavoriteCity: (city: string) => void;
  removeFavoriteCity: (city: string) => void;
  validateCity: (city: string) => Promise<boolean>;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      currentCity: "",
      weatherData: null,
      loading: false,
      favoriteCities: [],

      fetchDataForCity: async (city: string) => {
        if (!city || !city.trim()) {
          Alert.alert("Invalid Search", "Please enter a city name.");
          return;
        }
        set({ loading: true });
        try {
          const weatherRes = await fetch(`${API_URL}/weather/${city.trim()}`);
          if (!weatherRes.ok) {
            const errorData = await weatherRes.json();
            Alert.alert("Search Failed", errorData.message || "City not found.");
            set({ loading: false });
            return;
          }
          const weatherData = await weatherRes.json();
          set({ weatherData, currentCity: weatherData.name, loading: false });
        } catch {
          Alert.alert("Network Error", "Could not connect to the server.");
          set({ loading: false });
        }
      },

      fetchDataByCoords: async (lat: number, lon: number) => {
        set({ loading: true });
        try {
          const response = await fetch(`${API_URL}/weather/by-coords?lat=${lat}&lon=${lon}`);
          if (!response.ok) {
            const errorData = await response.json();
            // This provides a more user-friendly message for this specific error.
            const errorMessage = errorData.message === 'city not found'
              ? "Could not retrieve weather data for your current location. The service may not have data for this area."
              : errorData.message;
            throw new Error(errorMessage);
          }
          const combinedData = await response.json();
          set({
            weatherData: combinedData.weather,
            currentCity: combinedData.city,
            loading: false,
          });
        } catch (err: any) {
          Alert.alert("Location Error", err.message);
          set({ loading: false });
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

      validateCity: async (city: string): Promise<boolean> => {
        try {
          const response = await fetch(`${API_URL}/weather/${city}`);
          return response.ok;
        } catch {
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
