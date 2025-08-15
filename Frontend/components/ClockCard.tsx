import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ClockCardProps {
  city: string;
  timezone: string;
}

const ClockCard: React.FC<ClockCardProps> = ({ city, timezone }) => {
  const [timeData, setTimeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${timezone}`);
        if (!response.ok) {
          throw new Error('Failed to fetch time');
        }
        const data = await response.json();
        setTimeData(data);
      } catch (error) {
        console.error(`Failed to fetch time for ${timezone}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchTime();
  }, [timezone]);

  useEffect(() => {
    if (!timeData?.dateTime) return;

    const timer = setInterval(() => {
        setTimeData((prevData: any) => {
            const newDate = new Date(prevData.dateTime);
            newDate.setSeconds(newDate.getSeconds() + 1);
            return { ...prevData, dateTime: newDate.toISOString() };
        });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeData?.dateTime]);

  return (
    <View style={styles.card}>
        <View>
            <Text style={styles.cityText}>{city}</Text>
            <Text style={styles.dayText}>{timeData ? timeData.dayOfWeek : ''}</Text>
        </View>
      {loading || !timeData ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.timeText}>
          {new Date(timeData.dateTime).toLocaleTimeString('en-US', {
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
  dayText: {
    color: '#A0A0A0',
    fontSize: 14,
    marginTop: 4,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '500',
  },
});

export default ClockCard;
