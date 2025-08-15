import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

const DIAL_RADIUS = 150;
const DIAL_STROKE_WIDTH = 2;
const HAND_LENGTH = DIAL_RADIUS - 10;
const CENTER = DIAL_RADIUS;

interface AnalogStopwatchProps {
  time: number;
}

const AnalogStopwatch: React.FC<AnalogStopwatchProps> = ({ time }) => {
  const seconds = time / 1000;
  const angle = (seconds % 60) * 6; // 360 degrees / 60 seconds

  const handX = CENTER + HAND_LENGTH * Math.sin((angle * Math.PI) / 180);
  const handY = CENTER - HAND_LENGTH * Math.cos((angle * Math.PI) / 180);

  const renderTicks = () => {
    const ticks = [];
    for (let i = 0; i < 60; i++) {
      const isMajorTick = i % 5 === 0;
      const tickAngle = i * 6;
      const startX = CENTER + (DIAL_RADIUS - (isMajorTick ? 10 : 5)) * Math.sin((tickAngle * Math.PI) / 180);
      const startY = CENTER - (DIAL_RADIUS - (isMajorTick ? 10 : 5)) * Math.cos((tickAngle * Math.PI) / 180);
      const endX = CENTER + DIAL_RADIUS * Math.sin((tickAngle * Math.PI) / 180);
      const endY = CENTER - DIAL_RADIUS * Math.cos((tickAngle * Math.PI) / 180);

      ticks.push(
        <Line
          key={i}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={isMajorTick ? '#777' : '#444'}
          strokeWidth={isMajorTick ? 2 : 1}
        />
      );
    }
    return ticks;
  };

  return (
    <View style={styles.container}>
      <Svg height={DIAL_RADIUS * 2} width={DIAL_RADIUS * 2}>
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={DIAL_RADIUS - DIAL_STROKE_WIDTH / 2}
          stroke="#333"
          strokeWidth={DIAL_STROKE_WIDTH}
          fill="transparent"
        />
        {renderTicks()}
        {/* Blue dot at the top */}
        <Circle cx={CENTER} cy={DIAL_STROKE_WIDTH + 5} r="3" fill="#007AFF" />
        {/* Stopwatch Hand */}
        <Line
          x1={CENTER}
          y1={CENTER}
          x2={handX}
          y2={handY}
          stroke="#007AFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Center circle */}
        <Circle cx={CENTER} cy={CENTER} r="4" fill="#007AFF" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
});

export default AnalogStopwatch;
