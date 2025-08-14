import axios from 'axios';

export const fetchWeatherByCity = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("Missing OpenWeather API key");

  const encodedCity = encodeURIComponent(city);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchForecastByCity = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("Missing OpenWeather API key");

  const encodedCity = encodeURIComponent(city);
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCityByCoords = async (lat, lon) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("Missing OpenWeather API key");

  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data[0]?.name || null;
  } catch (error) {
    throw error;
  }
};
