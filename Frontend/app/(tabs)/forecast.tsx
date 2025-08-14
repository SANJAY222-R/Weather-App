import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import { useWeatherStore } from "@/store/useWeatherStore";
import DailyForecastItem from "@/components/DailyForecastItem";
import { ForecastItem } from "@/types";

export default function ForecastScreen() {
  const { forecastData, loading, error, currentCity } = useWeatherStore();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>
          {currentCity ? `${currentCity} Forecast` : "Forecast"}
        </Text>

        {loading && !forecastData.length ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : forecastData.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.infoText}>
              No forecast data available. Search for a city on the home screen.
            </Text>
          </View>
        ) : (
          <FlatList
            data={forecastData}
            keyExtractor={(item: ForecastItem) => item.dt.toString()}
            renderItem={({ item }) => (
              <DailyForecastItem
                item={{
                  day: new Date(item.dt * 1000).toLocaleDateString("en-US", {
                    weekday: "long",
                  }),
                  icon: item.weather[0].icon,
                  high: Math.round(item.main.temp_max),
                  low: Math.round(item.main.temp_min),
                }}
              />
            )}
            style={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131314",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 25 : 20, // Add padding to push content down
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EAEAEA",
    marginBottom: 20,
    textAlign: "center",
    marginTop: Platform.OS === "android" ? 20 : 0, // Adjust title margin for Android
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 18,
    textAlign: "center",
  },
  infoText: {
    color: "#EAEAEA",
    textAlign: "center",
    fontSize: 16,
  },
  list: {
    width: "100%",
  },
});
