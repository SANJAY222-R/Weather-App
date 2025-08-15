import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  FlatList,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import ClockCard from '@/components/ClockCard';
import CurrentLocationClock from '@/components/CurrentLocationClock';
import RemoveCityModal from '@/components/RemoveCityModal';
import { Ionicons } from '@expo/vector-icons';

// Greatly expanded list of famous default cities
const initialCities = [
    { city: 'Mumbai', timezone: 'Asia/Kolkata' },
    { city: 'New York', timezone: 'America/New_York' },
    { city: 'London', timezone: 'Europe/London' },
    { city: 'Tokyo', timezone: 'Asia/Tokyo' },
    { city: 'Los Angeles', timezone: 'America/Los_Angeles' },
    { city: 'Paris', timezone: 'Europe/Paris' },
    { city: 'Sydney', timezone: 'Australia/Sydney' },
    { city: 'Dubai', timezone: 'Asia/Dubai' },
];

// Massively expanded lookup map for common cities and regions
const cityTimezoneMap: { [key: string]: string } = {
    // India
    'mumbai': 'Asia/Kolkata',
    'delhi': 'Asia/Kolkata',
    'chennai': 'Asia/Kolkata',
    'madurai': 'Asia/Kolkata',
    'bangalore': 'Asia/Kolkata',
    'bengaluru': 'Asia/Kolkata',
    'kolkata': 'Asia/Kolkata',
    'calcutta': 'Asia/Kolkata',
    'hyderabad': 'Asia/Kolkata',
    'pune': 'Asia/Kolkata',
    'ahmedabad': 'Asia/Kolkata',
    'jaipur': 'Asia/Kolkata',
    // Americas
    'chicago': 'America/Chicago',
    'toronto': 'America/Toronto',
    'vancouver': 'America/Vancouver',
    'mexico city': 'America/Mexico_City',
    'sao paulo': 'America/Sao_Paulo',
    'buenos aires': 'America/Argentina/Buenos_Aires',
    'lima': 'America/Lima',
    'bogota': 'America/Bogota',
    'santiago': 'America/Santiago',
    'san francisco': 'America/Los_Angeles',
    'miami': 'America/New_York',
    'seattle': 'America/Los_Angeles',
    'boston': 'America/New_York',
    'washington dc': 'America/New_York',
    'houston': 'America/Chicago',
    'dallas': 'America/Chicago',
    'alaska': 'America/Anchorage',
    'hawaii': 'Pacific/Honolulu',
    // Europe
    'berlin': 'Europe/Berlin',
    'paris': 'Europe/Paris',
    'rome': 'Europe/Rome',
    'madrid': 'Europe/Madrid',
    'moscow': 'Europe/Moscow',
    'istanbul': 'Europe/Istanbul',
    'amsterdam': 'Europe/Amsterdam',
    'zurich': 'Europe/Zurich',
    'vienna': 'Europe/Vienna',
    'athens': 'Europe/Athens',
    'stockholm': 'Europe/Stockholm',
    'dublin': 'Europe/Dublin',
    // Asia & Middle East
    'beijing': 'Asia/Shanghai',
    'dubai': 'Asia/Dubai',
    'singapore': 'Asia/Singapore',
    'hong kong': 'Asia/Hong_Kong',
    'seoul': 'Asia/Seoul',
    'bangkok': 'Asia/Bangkok',
    'jakarta': 'Asia/Jakarta',
    'kuala lumpur': 'Asia/Kuala_Lumpur',
    'manila': 'Asia/Manila',
    'riyadh': 'Asia/Riyadh',
    'tehran': 'Asia/Tehran',
    'jerusalem': 'Asia/Jerusalem',
    // Africa & Oceania
    'cairo': 'Africa/Cairo',
    'lagos': 'Africa/Lagos',
    'johannesburg': 'Africa/Johannesburg',
    'nairobi': 'Africa/Nairobi',
    'casablanca': 'Africa/Casablanca',
    'melbourne': 'Australia/Melbourne',
    'auckland': 'Pacific/Auckland',
    'perth': 'Australia/Perth',
};

export default function WorldClockScreen() {
  const [cities, setCities] = useState(initialCities);
  const [inputCity, setInputCity] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [cityToRemove, setCityToRemove] = useState<{ city: string; timezone: string } | null>(null);

  const handleAddCity = async () => {
    if (inputCity.trim() === '') return;
    Keyboard.dismiss();
    const userInput = inputCity.trim();
    const userInputLower = userInput.toLowerCase();

    try {
      let foundTimezone: string | undefined;
      let displayCity = userInput;

      // 1. Check our comprehensive custom lookup map first
      if (cityTimezoneMap[userInputLower]) {
          foundTimezone = cityTimezoneMap[userInputLower];
      } else {
        // 2. If not in the map, search the API
        const formattedInput = userInput.replace(/ /g, '_');
        const response = await fetch(`https://timeapi.io/api/TimeZone/AvailableTimeZones`);
        if (!response.ok) throw new Error('Failed to fetch available timezones');
        
        const availableTimezones: string[] = await response.json();
        
        const directMatch = availableTimezones.find(tz => tz.toLowerCase() === formattedInput.toLowerCase());
        if (directMatch) {
            foundTimezone = directMatch;
            displayCity = directMatch.split('/').pop()?.replace(/_/g, ' ') || userInput;
        } else {
            foundTimezone = availableTimezones.find(tz => tz.toLowerCase().includes(formattedInput.toLowerCase()));
        }
      }

      if (foundTimezone) {
        if (!cities.some(c => c.city.toLowerCase() === displayCity.toLowerCase() && c.timezone.toLowerCase() === foundTimezone!.toLowerCase())) {
          const newCity = { city: displayCity, timezone: foundTimezone };
          setCities(prevCities => [...prevCities, newCity]);
        } else {
           Alert.alert('City Exists', `${displayCity} is already in your list.`);
        }
        setInputCity('');
      } else {
        Alert.alert(
            'Not Found', 
            `Could not find a timezone for "${userInput}". Please try another major city or a full timezone name (e.g., "Europe/London").`
        );
      }
    } catch (error) {
      console.error('Failed to add city:', error);
      Alert.alert('Error', 'Could not add the city. Please check your connection.');
    }
  };

  const openRemoveModal = (city: { city: string; timezone: string }) => {
    setCityToRemove(city);
    setModalVisible(true);
  };

  const confirmRemoveCity = () => {
    if (cityToRemove) {
      setCities(prevCities =>
        prevCities.filter(city => city.city !== cityToRemove.city || city.timezone !== cityToRemove.timezone)
      );
    }
    setModalVisible(false);
    setCityToRemove(null);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.content}>
          <CurrentLocationClock />
          <Text style={styles.title}>World Clock</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add any city or timezone..."
              placeholderTextColor="#888"
              value={inputCity}
              onChangeText={setInputCity}
              onSubmitEditing={handleAddCity}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddCity}>
               <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={cities}
            keyExtractor={(item) => item.city + item.timezone} // More unique key
            renderItem={({ item }) => (
              <TouchableOpacity onLongPress={() => openRemoveModal(item)}>
                <ClockCard city={item.city} timezone={item.timezone} />
              </TouchableOpacity>
            )}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
          />
        </View>
        
        <RemoveCityModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={confirmRemoveCity}
          cityName={cityToRemove?.city || ''}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#131314',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#EAEAEA',
      marginBottom: 20,
      textAlign: 'center',
    },
    list: {
      width: '100%',
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: 20,
      width: '100%',
    },
    input: {
      flex: 1,
      backgroundColor: '#1E1F20',
      color: '#FFFFFF',
      paddingHorizontal: 15,
      height: 50,
      borderRadius: 12,
      fontSize: 16,
    },
    addButton: {
      marginLeft: 10,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      width: 50,
      height: 50,
      borderRadius: 12,
      shadowColor: '#007AFF',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 10,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
