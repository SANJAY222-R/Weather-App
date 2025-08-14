import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ActivityIndicator,
  Text,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar";
import WeatherDisplay from "@/components/WeatherDisplay";
import { useWeatherStore } from "@/store/useWeatherStore";
import { useUserLocation } from "@/hooks/useUserLocation";

export default function TodayScreen() {
  const {
    weatherData,
    loading: weatherLoading,
    error: weatherError,
    fetchDataForCity,
    fetchDataByCoords,
    setError,
  } = useWeatherStore();

  const {
    location,
    loading: locationLoading,
    errorMsg: locationError,
    refetchLocation,
  } = useUserLocation();

  const [initialFetchAttempted, setInitialFetchAttempted] = useState(false);

  // --- EFFECT 1: Handles the initial data load when the app starts (No Changes) ---
  useEffect(() => {
    if (!locationLoading && !initialFetchAttempted) {
      if (location) {
        fetchDataByCoords(location.coords.latitude, location.coords.longitude);
      } else {
        Alert.alert(
          "Location Unavailable",
          locationError || "Could not access your location. Showing weather for Chennai as a fallback.",
          [{ text: "OK" }]
        );
        fetchDataForCity("Chennai");
      }
      setInitialFetchAttempted(true);
    }
  }, [location, locationLoading, initialFetchAttempted, fetchDataByCoords, fetchDataForCity, locationError]);

  // --- EFFECT 2: Handles API errors after a fetch attempt ---
  useEffect(() => {
    const isCoordLookupError = weatherError?.toLowerCase().includes("city not found");
    if (isCoordLookupError) {
      // CHANGE: Removed the Alert.alert() call.
      // Now, it will silently fetch the fallback city's weather without showing a popup.
      fetchDataForCity("Chennai");
      if (setError) {
        setError(null); // Clear the error to prevent this from running again
      }
    }
  }, [weatherError, fetchDataForCity, setError]);

  // --- CALLBACK: For the "current location" button ---
  const handleGetCurrentLocationWeather = useCallback(async () => {
    // CHANGE: Wrapped the logic in a try/catch block for better error handling.
    // The loading state is now handled by combining `locationLoading` and `weatherLoading`.
    try {
      const { location: newLocation, errorMsg: newError } = await refetchLocation();

      if (newLocation) {
        fetchDataByCoords(newLocation.coords.latitude, newLocation.coords.longitude);
      } else {
        Alert.alert(
          "Location Error",
          newError || "Failed to get your current location. Please ensure location services are enabled.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
        console.error("Failed to handle location weather fetch:", error);
        Alert.alert("Error", "An unexpected error occurred while fetching your location.");
    }
  }, [refetchLocation, fetchDataByCoords]);

  // --- RENDER LOGIC ---

  // A clear loading state for the very first time the app opens.
  const isInitialLoading = (locationLoading || weatherLoading) && !weatherData;

  // CHANGE: Created a single, reliable loading state for the location button.
  // This is true if we are getting the user's coordinates OR fetching weather data.
  const isButtonLoading = locationLoading || weatherLoading;

  const renderContent = () => {
    if (isInitialLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.infoText}>Fetching your location...</Text>
        </View>
      );
    }

    if (weatherError && !weatherData) {
      return <Text style={styles.errorText}>{weatherError}</Text>;
    }

    if (weatherData) {
      return <WeatherDisplay data={weatherData} />;
    }

    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>Search for a city or use the location button to get weather data.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.innerContainer}>
            <View style={styles.topBarContainer}>
              <View style={styles.searchBarWrapper}>
                <SearchBar onSearch={fetchDataForCity} />
              </View>
              {/* CHANGE: Updated the button's rendering logic for the loading state */}
              <TouchableOpacity
                onPress={handleGetCurrentLocationWeather}
                style={styles.locationButton}
                disabled={isButtonLoading} // Disable button during any loading phase
              >
                {/* Show a spinner if the location or weather is being fetched */}
                {isButtonLoading && !!weatherData ? ( // Only show spinner if there is already data on screen
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Ionicons name="navigate-circle-outline" size={36} color="#fff" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.weatherContent}>
              {renderContent()}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles (No Changes)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131314",
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 25 : 10,
  },
  topBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchBarWrapper: {
    flex: 1,
  },
  locationButton: {
    marginLeft: 10,
    height: 58,
    width: 58,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1F20',
    borderRadius: 15,
    marginTop: 40,
  },
  weatherContent: {
    flex: 1,
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
    textAlign: 'center',
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 18,
    textAlign: "center",
    padding: 15,
  },
});









