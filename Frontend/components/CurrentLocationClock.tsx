import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

const CurrentLocationClock = () => {
  const [timeData, setTimeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied. Showing default time.');
          await fetchTimeForZone('America/New_York'); // Fallback
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const response = await fetch(`https://timeapi.io/api/Time/current/coordinate?latitude=${latitude}&longitude=${longitude}`);
        if (!response.ok) {
          throw new Error('Could not fetch time for your location.');
        }
        const data = await response.json();
        setTimeData(data);
      } catch (e) {
        setError('Failed to fetch time data. Showing default time.');
        console.error(e);
        await fetchTimeForZone('America/New_York'); // Fallback
      } finally {
        setLoading(false);
      }
    };
    
    const fetchTimeForZone = async (zone: string) => {
        try {
            const response = await fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${zone}`);
            if (!response.ok) throw new Error('Fallback fetch failed');
            const data = await response.json();
            setTimeData(data);
        } catch (e) {
            console.error(e);
            setError('Failed to fetch any time data.');
        }
    };

    fetchTime();
  }, []);

  useEffect(() => {
    if (!timeData?.dateTime) return;

    const interval = setInterval(() => {
      setTimeData((prevData: any) => {
        if (!prevData) return null;
        const newDate = new Date(prevData.dateTime);
        newDate.setSeconds(newDate.getSeconds() + 1);
        return { ...prevData, dateTime: newDate.toISOString() };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeData?.dateTime]);

  if (loading) {
    return <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />;
  }

  if (error && !timeData) {
    return <Text style={styles.errorText}>{error}</Text>;
  }
  
  if (!timeData) {
    return null;
  }

  const displayTime = new Date(timeData.dateTime);

  return (
    <View style={styles.container}>
      <Text style={styles.cityText}>My Location</Text>
      <Text style={styles.timezoneText}>{timeData.timeZone.replace(/_/g, ' ')}</Text>
      <Text style={styles.timeText}>
        {displayTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      <Text style={styles.dateText}>{displayTime.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      paddingVertical: 20,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#282828',
      marginBottom: 20,
    },
    loader: {
      marginVertical: 50,
    },
    errorText: {
      color: '#ff4d4d',
      fontSize: 16,
      textAlign: 'center',
      marginVertical: 50,
    },
    cityText: {
      color: '#EAEAEA',
      fontSize: 24,
      fontWeight: 'bold',
    },
    timezoneText: {
      color: '#A0A0A0',
      fontSize: 16,
      marginBottom: 10,
    },
    timeText: {
      color: '#FFFFFF',
      fontSize: 60,
      fontWeight: '200',
    },
    dateText: {
      color: '#A0A0A0',
      fontSize: 16,
      marginTop: 5,
    },
  });

export default CurrentLocationClock;
