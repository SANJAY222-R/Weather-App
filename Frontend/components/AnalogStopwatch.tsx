import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';

const DIAL_RADIUS = 110; // Reduced from 150 to 110
const DIAL_STROKE_WIDTH = 2;
const HAND_LENGTH = DIAL_RADIUS - 10;
const CENTER = DIAL_RADIUS;

interface AnalogStopwatchProps {
  time: number;
}

const AnalogStopwatch: React.FC<AnalogStopwatchProps> = ({ time }) => {
  const seconds = time / 1000;
  const angle = (seconds % 60) * 6;

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
          key={`tick-${i}`}
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

  const renderNumbers = () => {
      const numbers = [];
      for (let i = 1; i <= 12; i++) {
        const angle = i * 30;
        const text = (i * 5).toString();
        const displayText = text === '60' ? '60' : text;
        const numberX = CENTER + (DIAL_RADIUS - 22) * Math.sin((angle * Math.PI) / 180); // Adjusted position for smaller radius
        const numberY = CENTER - (DIAL_RADIUS - 22) * Math.cos((angle * Math.PI) / 180); // Adjusted position

        numbers.push(
            <SvgText
                key={`num-${i}`}
                x={numberX}
                y={numberY}
                fontSize="14" // Reduced font size
                fill="#A9A9A9"
                textAnchor="middle"
                alignmentBaseline="central"
            >
                {displayText}
            </SvgText>
        )
      }
      return numbers;
  }

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
        {renderNumbers()}
        <Circle cx={CENTER} cy={DIAL_STROKE_WIDTH + 5} r="3" fill="#007AFF" />
        <Line
          x1={CENTER}
          y1={CENTER}
          x2={handX}
          y2={handY}
          stroke="#007AFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Circle cx={CENTER} cy={CENTER} r="4" fill="#007AFF" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15, // Reduced margin
  },
});

export default AnalogStopwatch;