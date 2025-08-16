import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ActivityIndicator,
  Text,
  StatusBar,
  Keyboard,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar";
import WeatherDisplay from "@/components/WeatherDisplay";
import { useWeatherStore } from "@/store/useWeatherStore";
import { useUserLocation } from "@/hooks/useUserLocation";

export default function TodayScreen() {
  // ✅ REMOVED: weatherError is no longer needed here
  const {
    weatherData,
    loading: weatherLoading,
    fetchDataForCity,
    fetchDataByCoords,
  } = useWeatherStore();

  const {
    location,
    loading: locationLoading,
    errorMsg: locationError,
    refetchLocation,
  } = useUserLocation();

  const [initialFetchAttempted, setInitialFetchAttempted] = useState(false);

  useEffect(() => {
    if (!locationLoading && !initialFetchAttempted) {
      if (location) {
        fetchDataByCoords(location.coords.latitude, location.coords.longitude);
      } else {
        Alert.alert(
          "Location Unavailable",
          locationError ||
            "Could not access your location. Please search for a city manually.",
          [{ text: "OK" }]
        );
      }
      setInitialFetchAttempted(true);
    }
  }, [
    location,
    locationLoading,
    initialFetchAttempted,
    fetchDataByCoords,
    locationError,
  ]);

  const handleGetCurrentLocationWeather = useCallback(async () => {
    try {
      const { location: newLocation, errorMsg: newError } =
        await refetchLocation();

      if (newLocation) {
        fetchDataByCoords(
          newLocation.coords.latitude,
          newLocation.coords.longitude
        );
      } else {
        Alert.alert(
          "Location Error",
          newError ||
            "Failed to get your current location. Please ensure location services are enabled.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Failed to handle location weather fetch:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while fetching your location."
      );
    }
  }, [refetchLocation, fetchDataByCoords]);

  // ✅ RENAMED: isInitialLoading to be more specific
  const isFirstLoad = weatherLoading && !weatherData && !initialFetchAttempted;
  const isButtonLoading = locationLoading || weatherLoading;

  const renderContent = () => {
    if (isFirstLoad) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.infoText}>Fetching your location...</Text>
        </View>
      );
    }

    // ✅ REMOVED: The error display logic is no longer needed here
    // if (weatherError && !weatherData) { ... }

    if (weatherData) {
      return <WeatherDisplay data={weatherData} />;
    }

    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>
          Search for a city or use the location button to get weather data.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        enabled
      >
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          onScrollBeginDrag={Keyboard.dismiss}
        >
          <View style={styles.topBarContainer}>
            <View style={styles.searchBarWrapper}>
              <SearchBar onSearch={fetchDataForCity} />
            </View>
            <TouchableOpacity
              onPress={handleGetCurrentLocationWeather}
              style={styles.locationButton}
              disabled={isButtonLoading}
            >
              {isButtonLoading && weatherData ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons
                  name="navigate-circle-outline"
                  size={36}
                  color="#fff"
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.weatherContent}>{renderContent()}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131314",
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: "flex-start", // Align content to the top
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 20,
  },
  topBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchBarWrapper: {
    flex: 1,
    marginBottom: 35,
  },
  locationButton: {
    marginLeft: 10,
    height: 58,
    width: 58,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1F20",
    borderRadius: 15,
  },
  weatherContent: {
    flex: 1, // Allow this view to take up remaining space
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoText: {
    color: "#EAEAEA",
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 18,
    textAlign: "center",
    padding: 15,
  },
});
