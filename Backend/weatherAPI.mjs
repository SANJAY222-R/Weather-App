import axios from 'axios';

// Fetches weather by city name (for search)
export const fetchWeatherByCity = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("Missing OpenWeather API key");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  return (await axios.get(url)).data;
};

// Converts coordinates to a city name (for display purposes only)
export const fetchCityByCoords = async (lat, lon) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("Missing OpenWeather API key");
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
  const response = await axios.get(url);
  return response.data[0]?.name || null;
};

// ✅ Fetches weather directly by coordinates (more reliable)
export const fetchWeatherByCoords = async (lat, lon) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("Missing OpenWeather API key");
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  return (await axios.get(url)).data;
};
