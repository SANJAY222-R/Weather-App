import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard, // 1. Import Keyboard
} from "react-native";

interface SearchBarProps {
  onSearch: (city: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (city.trim()) {
      Keyboard.dismiss(); // 2. Dismiss the keyboard
      onSearch(city.trim());
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={city}
        onChangeText={setCity}
        placeholder="Search for a city..."
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        style={styles.input}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleSearch}
        activeOpacity={0.7}
      >
        <Text style={styles.searchIcon}>🔍</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingLeft: 20,
    marginTop: 40,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#fff",
  },
  searchButton: {
    paddingHorizontal: 18,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    fontSize: 20,
  },
});
