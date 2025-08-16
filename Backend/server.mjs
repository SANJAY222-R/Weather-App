import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  fetchWeatherByCity,
  fetchCityByCoords,
  fetchWeatherByCoords,
} from "./weatherAPI.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Route for searching by city name (no changes needed)
app.get("/api/weather/:city", async (req, res) => {
  try {
    const weatherData = await fetchWeatherByCity(req.params.city);
    res.json(weatherData);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "An internal server error occurred.";
    res.status(status).json({ message });
  }
});

// ✅ FINAL CORRECTED Route for fetching by coordinates
app.get("/api/weather/by-coords", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ message: "Latitude and longitude are required." });
    }

    // Step 1: Get the essential weather data. This is the only part that can fail the request.
    const weatherData = await fetchWeatherByCoords(lat, lon);

    // Step 2: Separately, try to get the city name. This part is optional and will not crash the request if it fails.
    let cityName = null;
    try {
      // This call might fail, but we catch it so it doesn't interrupt the successful response.
      cityName = await fetchCityByCoords(lat, lon);
    } catch (nameError) {
      console.error("Could not fetch city name, but proceeding since weather data was found.");
    }

    // Step 3: Send the successful response.
    // Use the city name from the lookup if available, otherwise fallback to the name from the weather data itself.
    res.json({
      city: cityName || weatherData.name,
      weather: weatherData,
    });
    
  } catch (error) {
    // This block only runs if the critical `fetchWeatherByCoords` call fails.
    console.error("--- CRITICAL ERROR in /weather/by-coords ---", error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to get weather for your location.";
    res.status(status).json({ message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running with final, robust routes on port ${PORT}`);
});
