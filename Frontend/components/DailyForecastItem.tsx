import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// This would be defined in your types.ts file
interface DailyData {
  day: string;
  icon: string;
  high: number;
  low: number;
}

interface DailyForecastItemProps {
  item: DailyData;
}

export default function DailyForecastItem({ item }: DailyForecastItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.dayText}>{item.day}</Text>
      <Image
        source={{ uri: `https://openweathermap.org/img/wn/${item.icon}@2x.png` }}
        style={styles.icon}
      />
      <View style={styles.tempContainer}>
        <Text style={styles.tempText}>{item.high}°</Text>
        <Text style={styles.tempTextLow}>{item.low}°</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    backgroundColor: '#1E1F20',
    borderRadius: 15,
  },
  dayText: {
    color: '#EAEAEA',
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
  icon: {
    width: 50,
    height: 50,
  },
  tempContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  tempText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
  },
  tempTextLow: {
    color: '#A0A0A0',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
  },
});