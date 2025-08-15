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
        <View style={styles.timerContainer}>
          <AnalogStopwatch time={time} />
          <Text style={styles.timerText}>{formatTime(time)}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={handleLapReset}
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

        <ScrollView style={styles.lapsContainer}>
          {laps.map((lap, index) => (
            <View key={index} style={styles.lapItem}>
              <Text style={styles.lapText}>Lap {laps.length - index}</Text>
              <Text style={styles.lapText}>{formatTime(lap)}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131314',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 + 20 : 20,
    marginTop:70,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 300, 
    width: 300,
    marginBottom: 40,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 56,
    fontWeight: '200',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'monospace',
    position: 'absolute',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 40,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  startButton: {
    backgroundColor: 'rgba(51, 204, 102, 0.2)',
  },
  startButtonText: {
    color: '#33CC66',
  },
  stopButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  stopButtonText: {
    color: '#FF3B30',
  },
  resetButton: {
    backgroundColor: '#333333',
  },
  lapsContainer: {
    width: '80%',
    flex: 1,
  },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  lapText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
