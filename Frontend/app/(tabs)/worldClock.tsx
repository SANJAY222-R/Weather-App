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
import RemoveCityModal from '@/components/RemoveCityModal'; // Import the new modal

const initialCities = [
  { city: 'New York', timezone: 'America/New_York' },
  { city: 'London', timezone: 'Europe/London' },
  { city: 'Paris', timezone: 'Europe/Paris' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo' },
  { city: 'Sydney', timezone: 'Australia/Sydney' },
  { city: 'Dubai', timezone: 'Asia/Dubai' },
  { city: 'Shanghai', timezone: 'Asia/Shanghai' },
  { city: 'Los Angeles', timezone: 'America/Los_Angeles' },
  { city: 'Moscow', timezone: 'Europe/Moscow' },
  { city: 'Singapore', timezone: 'Asia/Singapore' },
  { city: 'Chennai', timezone: 'Asia/Kolkata' },
];

export default function WorldClockScreen() {
  const [cities, setCities] = useState(initialCities);
  const [inputCity, setInputCity] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [cityToRemove, setCityToRemove] = useState<{ city: string; timezone: string } | null>(null);

  const handleAddCity = async () => {
    if (inputCity.trim() === '') {
      Alert.alert('Input Required', 'Please enter a city name.');
      return;
    }
    Keyboard.dismiss();

    try {
      const formattedInput = inputCity.trim().replace(/ /g, '_');
      const response = await fetch(`https://timeapi.io/api/TimeZone/AvailableTimeZones`);
      if (!response.ok) throw new Error('Failed to fetch available timezones');
      
      const availableTimezones: string[] = await response.json();
      const foundTimezone = availableTimezones.find(tz => tz.toLowerCase().includes(formattedInput.toLowerCase()));

      if (foundTimezone) {
        if (!cities.some(c => c.timezone.toLowerCase() === foundTimezone.toLowerCase())) {
          const newCity = { city: inputCity.trim(), timezone: foundTimezone };
          setCities(prevCities => [...prevCities, newCity]);
        } else {
           Alert.alert('City Exists', `${inputCity.trim()} is already in your list.`);
        }
        setInputCity('');
      } else {
        Alert.alert('Not Found', `Could not find a timezone for "${inputCity.trim()}".`);
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
        prevCities.filter(city => city.timezone !== cityToRemove.timezone)
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
              placeholder="Add city or timezone..."
              placeholderTextColor="#888"
              value={inputCity}
              onChangeText={setInputCity}
              onSubmitEditing={handleAddCity}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddCity}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={cities}
            keyExtractor={(item) => item.timezone}
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
      paddingHorizontal: 20,
      height: 50,
      borderRadius: 12,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
