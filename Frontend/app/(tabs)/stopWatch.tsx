import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AnalogStopwatch from '@/components/AnalogStopwatch';

// Helper function to format the time
const formatTime = (time: number) => {
  const milliseconds = Math.floor((time % 1000) / 10);
  const seconds = Math.floor((time / 1000) % 60);
  const minutes = Math.floor((time / (1000 * 60)) % 60);

  const formattedMilliseconds = milliseconds.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
};

export default function StopWatchScreen() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const handleStartStop = () => {
    if (isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      startTimeRef.current = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    }
    setIsRunning(!isRunning);
  };

  const handleLapReset = () => {
    if (isRunning) {
      setLaps(prevLaps => [time, ...prevLaps]);
    } else {
      setTime(0);
      setLaps([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Stopwatch</Text>
        
        <AnalogStopwatch time={time} />
        <Text style={styles.timerText}>{formatTime(time)}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={handleLapReset}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>
              {isRunning ? 'Lap' : 'Reset'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              isRunning ? styles.stopButton : styles.startButton,
            ]}
            onPress={handleStartStop}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.buttonText,
                isRunning ? styles.stopButtonText : styles.startButtonText,
              ]}
            >
              {isRunning ? 'Stop' : 'Start'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.lapsWrapper}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {laps.length > 0 && (
                <View style={styles.lapsHeader}>
                  <Text style={styles.lapHeaderText}>Lap</Text>
                  <Text style={styles.lapHeaderText}>Time</Text>
                </View>
            )}
            {laps.map((lap, index) => (
              <View key={index} style={styles.lapItem}>
                <Text style={styles.lapText}>Lap {laps.length - index}</Text>
                <Text style={styles.lapText}>{formatTime(lap)}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 15, // Reduced margin
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 52, // Slightly smaller font
    fontWeight: '200',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'monospace',
    marginBottom: 25, // Reduced margin
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 25, // Reduced margin
  },
  button: {
    width: 80, // Slightly smaller buttons
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 16,
  },
  startButton: {
    backgroundColor: 'rgba(46, 204, 113, 0.25)',
    borderColor: '#2ECC71',
  },
  startButtonText: {
    color: '#2ECC71',
  },
  stopButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.25)',
    borderColor: '#E74C3C',
  },
  stopButtonText: {
    color: '#E74C3C',
  },
  resetButton: {
    backgroundColor: '#333333',
    borderColor: '#555555',
  },
  lapsWrapper: {
    flex: 1,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#282828',
    paddingTop: 10,
  },
  lapsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  lapHeaderText: {
    color: '#A9A9A9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
    paddingHorizontal: 10,
  },
  lapText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontVariant: ['tabular-nums'],
  },
});