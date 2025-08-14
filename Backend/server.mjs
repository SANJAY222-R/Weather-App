import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  fetchWeatherByCity,
  fetchForecastByCity,
  fetchCityByCoords,
} from "./weatherAPI.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// --- ROUTE 1: FOR CURRENT WEATHER ---
app.get("/api/weather/:city", async (req, res) => {
  try {
    const { city } = req.params;
    if (!city || !city.trim()) {
      return res.status(400).json({ message: "City parameter is required." });
    }

    const weatherData = await fetchWeatherByCity(city.trim());
    res.json(weatherData);
  } catch (error) {
    console.error("--- DETAILED ERROR in /weather ---");
    if (error.response) {
      console.error("Data:", error.response.data);
      console.error("Status:", error.response.status);
    } else {
      console.error("Error Message:", error.message);
    }
    console.error("--- END DETAILED ERROR ---");

    const status = error.response ? error.response.status : 500;
    const message = error.response
      ? error.response.data.message
      : "An internal server error occurred.";
    res.status(status).json({ message });
  }
});

// --- ROUTE 2: FOR 5-DAY FORECAST ---
app.get("/api/forecast/:city", async (req, res) => {
  try {
    const { city } = req.params;
    if (!city || !city.trim()) {
      return res.status(400).json({ message: "City parameter is required." });
    }

    const rawForecastData = await fetchForecastByCity(city.trim());

    // Get one forecast per day at noon
    const dailyForecasts = rawForecastData.list.filter((reading) =>
      reading.dt_txt.includes("12:00:00")
    );

    res.json(dailyForecasts);
  } catch (error) {
    console.error("--- DETAILED ERROR in /forecast ---");
    if (error.response) {
      console.error("Data:", error.response.data);
      console.error("Status:", error.response.status);
    } else {
      console.error("Error Message:", error.message);
    }
    console.error("--- END DETAILED ERROR ---");

    const status = error.response ? error.response.status : 500;
    const message = error.response
      ? error.response.data.message
      : "An internal server error occurred.";
    res.status(status).json({ message });
  }
});

// --- ROUTE 3: WEATHER BY COORDINATES ---
app.get("/api/weather/by-coords", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({
        message: "Latitude and longitude query parameters are required.",
      });
    }

    const cityName = await fetchCityByCoords(lat, lon);
    if (!cityName) {
      return res
        .status(404)
        .json({ message: "City not found for coordinates" });
    }

    // If you only want the city name (current logic):
    // return res.json({ city: cityName });

    // Or: fetch full weather + forecast directly here:
    const weatherData = await fetchWeatherByCity(cityName);
    const rawForecastData = await fetchForecastByCity(cityName);
    const dailyForecasts = rawForecastData.list.filter((reading) =>
      reading.dt_txt.includes("12:00:00")
    );

    res.json({
      city: cityName,
      weather: weatherData,
      forecast: dailyForecasts,
    });
  } catch (error) {
    console.error("--- DETAILED ERROR in /weather/by-coords ---");
    if (error.response) {
      console.error("Data:", error.response.data);
      console.error("Status:", error.response.status);
    } else {
      console.error("Error Message:", error.message);
    }
    console.error("--- END DETAILED ERROR ---");

    const status = error.response ? error.response.status : 500;
    const message = error.response
      ? error.response.data.message
      : "An internal server error occurred.";
    res.status(status).json({ message });
  }
});

app.listen(PORT, () => {
  console.log(
    `✅ Server running with weather and forecast routes on port ${PORT}`
  );
});
