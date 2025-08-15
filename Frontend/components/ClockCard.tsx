import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ClockCardProps {
  city: string;
  timezone: string;
}

const ClockCard: React.FC<ClockCardProps> = ({ city, timezone }) => {
  const [time, setTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await fetch(`http://worldtimeapi.org/api/timezone/${timezone}`);
        if (!response.ok) {
          throw new Error('Failed to fetch time');
        }
        const data = await response.json();
        setTime(new Date(data.datetime));
      } catch (error) {
        console.error(`Failed to fetch time for ${timezone}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchTime();
  }, [timezone]);

  useEffect(() => {
    if (!time) return;

    const timer = setInterval(() => {
      setTime(prevTime => {
        if (prevTime) {
          const newTime = new Date(prevTime);
          newTime.setSeconds(newTime.getSeconds() + 1);
          return newTime;
        }
        return null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  return (
    <View style={styles.card}>
      <Text style={styles.cityText}>{city}</Text>
      {loading || !time ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.timeText}>
          {time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1F20',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  cityText: {
    color: '#EAEAEA',
    fontSize: 18,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '500',
  },
});

export default ClockCard;
