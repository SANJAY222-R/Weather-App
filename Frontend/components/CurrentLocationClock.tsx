import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const CurrentLocationClock = () => {
  const [timeData, setTimeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await fetch(`http://worldtimeapi.org/api/ip`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTimeData(data);
      } catch (e) {
        setError('Failed to fetch time data.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchTime();
  }, []);

  useEffect(() => {
    if (!timeData) return;

    const interval = setInterval(() => {
      const newDate = new Date(timeData.datetime);
      newDate.setSeconds(newDate.getSeconds() + 1);
      setTimeData({ ...timeData, datetime: newDate.toISOString() });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeData]);

  if (loading) {
    return <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!timeData) {
    return null;
  }

  const displayTime = new Date(timeData.datetime);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.cityText}>My Location</Text>
      <Text style={styles.timezoneText}>{timeData.timezone.replace('_', ' ')}</Text>
      <Text style={styles.timeText}>
        {displayTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      <Text style={styles.dateText}>{formatDate(displayTime)}</Text>
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
