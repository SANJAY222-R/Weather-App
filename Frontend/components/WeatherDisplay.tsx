import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { WeatherData } from "../types";

interface WeatherDisplayProps {
  data: WeatherData;
}

export default function WeatherDisplay({ data }: WeatherDisplayProps) {
  const { name, main, weather, sys } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;

  return (
    <View style={styles.card}>
      <Text style={styles.cityName}>
        {name}, {sys.country}
      </Text>
      <Image source={{ uri: iconUrl }} style={styles.icon} />
      <Text style={styles.temperature}>{Math.round(main.temp)}°</Text>
      <Text style={styles.description}>{weather[0].description}</Text>
      <View style={styles.divider} />
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Feels Like</Text>
          <Text style={styles.detailValue}>{Math.round(main.feels_like)}°</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{main.humidity}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1F20", // Consistent dark gray
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    width: "100%",
    maxWidth: 360,
    marginTop: 30,
  },
  cityName: {
    fontSize: 32,
    fontWeight: "400",
    color: "#EAEAEA",
  },
  icon: {
    width: 160,
    height: 160,
    // Note: The icon from OpenWeatherMap has its own colors.
    // For a true monochrome look, you'd need a custom icon set.
  },
  temperature: {
    fontSize: 96,
    fontWeight: "200",
    color: "#FFFFFF",
  },
  description: {
    fontSize: 22,
    color: "#A0A0A0", // Lighter gray for secondary text
    textTransform: "capitalize",
    marginTop: -5,
  },
  divider: {
    height: 1,
    backgroundColor: "#3A3B3C", // Darker gray for the divider
    width: "80%",
    marginVertical: 25,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  detailItem: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#A0A0A0",
  },
  detailValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 4,
  },
});
