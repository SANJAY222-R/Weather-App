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
  ScrollView, // --- FIX: Import ScrollView ---
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

  // No changes to effects or handlers
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

  useEffect(() => {
    const isCoordLookupError = weatherError?.toLowerCase().includes("city not found");
    if (isCoordLookupError) {
      fetchDataForCity("Chennai");
      if (setError) {
        setError(null);
      }
    }
  }, [weatherError, fetchDataForCity, setError]);

  const handleGetCurrentLocationWeather = useCallback(async () => {
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

  const isInitialLoading = (locationLoading || weatherLoading) && !weatherData;
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
      {/* --- FIX: Using "height" behavior can work better when the child is a ScrollView --- */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        enabled
      >
        {/* --- FIX: Replaced TouchableWithoutFeedback and View with ScrollView --- */}
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          onScrollBeginDrag={Keyboard.dismiss} // Dismiss keyboard on scroll
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
              {isButtonLoading && !!weatherData ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons name="navigate-circle-outline" size={36} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.weatherContent}>
            {renderContent()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- FIX: Style adjustments for ScrollView ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131314",
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  // Replaced innerContainer with a style for the ScrollView's content
  scrollContentContainer: {
    flexGrow: 1, // Ensures the content can grow to fill the screen
    justifyContent: 'center', // Helps vertically center content when it's short
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
    // Removed flex: 1 as ScrollView handles the layout
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