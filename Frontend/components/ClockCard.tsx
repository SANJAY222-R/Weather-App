import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator ,Platform} from 'react-native';

interface ClockCardProps {
  city: string;
  timezone: string;
}

const ClockCard: React.FC<ClockCardProps> = ({ city, timezone }) => {
  const [timeData, setTimeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTime = async () => {
      setLoading(true); 
      setTimeData(null);
      try {
        const response = await fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${timezone}`);
        if (!response.ok) throw new Error('Failed to fetch time');
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
            if (!prevData) return null;
            const newDate = new Date(prevData.dateTime);
            newDate.setSeconds(newDate.getSeconds() + 1);
            return { ...prevData, dateTime: newDate.toISOString() };
        });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeData?.dateTime]);

  const displayDate = timeData ? new Date(timeData.dateTime) : null;

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.cityText}>{city}</Text>
        {displayDate && (
          <Text style={styles.dateText}>
            {displayDate.toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        )}
      </View>
      <View style={styles.timeContainer}>
        {loading || !displayDate ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.timeText}>
            {displayDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1F20',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 12,
  },
  infoContainer: {
    flex: 1,
  },
  cityText: {
    color: '#EAEAEA',
    fontSize: 20,
    fontWeight: '600',
  },
  dateText: {
    color: '#A0A0A0',
    fontSize: 14,
    marginTop: 5,
  },
  timeContainer: {
    marginLeft: 15,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'monospace',
  },
});

export default ClockCard;
