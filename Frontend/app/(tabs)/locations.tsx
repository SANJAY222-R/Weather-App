import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Keyboard,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useWeatherStore } from "@/store/useWeatherStore";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LocationsScreen() {
  const {
    favoriteCities,
    setCurrentCity,
    addFavoriteCity,
    removeFavoriteCity,
    validateCity,
  } = useWeatherStore();

  const [newCity, setNewCity] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const handleSelectCity = (city: string) => {
    setCurrentCity(city);
    router.push("/");
  };

  const handleAddCity = async () => {
    const cityToAdd = newCity.trim();
    if (!cityToAdd) return;

    Keyboard.dismiss();
    setIsVerifying(true);

    const isValid = await validateCity(cityToAdd);

    setIsVerifying(false);

    if (isValid) {
      addFavoriteCity(cityToAdd);
      setNewCity("");
    } else {
      Alert.alert(
        "Invalid City",
        `We couldn't find "${cityToAdd}". Please check the name and try again.`
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Saved Locations</Text>

        {/* Add new city */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a new city..."
            placeholderTextColor="#8e8e8e"
            value={newCity}
            onChangeText={setNewCity}
            onSubmitEditing={handleAddCity}
            returnKeyType="done"
            editable={!isVerifying}
          />
          <TouchableOpacity
            onPress={handleAddCity}
            style={styles.addButton}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Ionicons name="add" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* City List */}
        {favoriteCities.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.infoText}>
              {/* ✅ FIXED: Escaped the apostrophe */}
              You haven&apos;t added any favorite cities yet.
            </Text>
          </View>
        ) : (
          <FlatList
            data={favoriteCities}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.cityItem}>
                <TouchableOpacity
                  onPress={() => handleSelectCity(item)}
                  style={styles.cityTouchable}
                >
                  <Text style={styles.cityText}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeFavoriteCity(item)}>
                  <Ionicons name="trash-outline" size={24} color="#ff4d4d" />
                </TouchableOpacity>
              </View>
            )}
            style={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#131314" },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 25 : 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EAEAEA",
    marginBottom: 20,
    textAlign: "center",
    marginTop: Platform.OS === "android" ? 20 : 0,
  },
  list: { width: "100%" },
  cityItem: {
    backgroundColor: "#1E1F20",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cityTouchable: {
    flex: 1,
    paddingVertical: 10,
  },
  cityText: { color: "#EAEAEA", fontSize: 18 },
  inputContainer: { flexDirection: "row", marginBottom: 20 },
  input: {
    flex: 1,
    backgroundColor: "#1E1F20",
    padding: 15,
    borderRadius: 15,
    color: "#EAEAEA",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#007AFF",
    width: 55,
    borderRadius: 15,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    color: "#888",
    textAlign: "center",
    fontSize: 16,
  },
});