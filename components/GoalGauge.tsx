import React from "react";
import { View, Text } from "react-native";
import Svg, { Path, Line, Circle, Defs, LinearGradient, Stop } from "react-native-svg";

type GoalGaugeProps = {
  value: number; // 0 a 100
  size?: number;
  label?: string;
};

const DEFAULT_SIZE = 220;

function polarToCartesian(cx: number, cy: number, r: number, pct: number) {
  const angleDeg = 180 - (pct / 100) * 180;
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

export function GoalGauge({
  value,
  size = DEFAULT_SIZE,
  label = "Progresso",
}: GoalGaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const cx = size / 2;
  const cy = size * 0.58;
  const radius = size * 0.4;
  const strokeWidth = size * 0.038;

  const needleAngleDeg = -90 + (clamped / 100) * 180;
  const needleAngleRad = (needleAngleDeg * Math.PI) / 180;
  const needleLength = radius * 0.88;
  const needleEndX = cx + needleLength * Math.cos(needleAngleRad);
  const needleEndY = cy + needleLength * Math.sin(needleAngleRad);

  const startX = cx - radius;
  const startY = cy;
  const endX = cx + radius;
  const endY = cy;
  const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;

  const progressEndX = cx + radius * Math.cos(needleAngleRad);
  const progressEndY = cy + radius * Math.sin(needleAngleRad);
  const progressPath = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${progressEndX} ${progressEndY}`;

  const majorTicks = [0, 50, 100];
  const minorTicks = [10, 20, 30, 40, 60, 70, 80, 90];
  const majorTickLength = size * 0.028;
  const minorTickLength = size * 0.014;

  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={size} height={size * 0.85} viewBox={`0 0 ${size} ${size * 0.85}`}>
        <Defs>
          <LinearGradient id="progressGradient" x1={startX} y1={startY} x2={endX} y2={endY}>
            <Stop offset="0%" stopColor="#00cc6a" stopOpacity={1} />
            <Stop offset="100%" stopColor="#00ff88" stopOpacity={1} />
          </LinearGradient>
          <LinearGradient id="glowGradient" x1={startX} y1={startY} x2={endX} y2={endY}>
            <Stop offset="0%" stopColor="#00ff88" stopOpacity={0.15} />
            <Stop offset="100%" stopColor="#00ff88" stopOpacity={0.35} />
          </LinearGradient>
        </Defs>
        {/* Glow atrás do arco de progresso */}
        <Path
          d={progressPath}
          stroke="url(#glowGradient)"
          strokeWidth={strokeWidth * 1.8}
          fill="none"
          strokeLinecap="round"
        />
        {/* Arco de fundo */}
        <Path
          d={arcPath}
          stroke="#2a2a2a"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        {/* Arco de progresso com gradiente */}
        <Path
          d={progressPath}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        {/* Marcas principais (0, 50, 100) */}
        {majorTicks.map((pct) => {
          const inner = polarToCartesian(cx, cy, radius - majorTickLength, pct);
          const outer = polarToCartesian(cx, cy, radius, pct);
          return (
            <Line
              key={`m-${pct}`}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#555"
              strokeWidth={2}
            />
          );
        })}
        {/* Marcas menores (10, 20, ...) */}
        {minorTicks.map((pct) => {
          const inner = polarToCartesian(cx, cy, radius - minorTickLength, pct);
          const outer = polarToCartesian(cx, cy, radius, pct);
          return (
            <Line
              key={`n-${pct}`}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#3a3a3a"
              strokeWidth={1}
            />
          );
        })}
        {/* Centro (eixo) */}
        <Circle
          cx={cx}
          cy={cy}
          r={size * 0.05}
          fill="#0a0a0a"
          stroke="#00ff88"
          strokeWidth={2.5}
        />
        {/* Sombra do ponteiro (para profundidade) */}
        <Line
          x1={cx}
          y1={cy}
          x2={needleEndX}
          y2={needleEndY}
          stroke="#1a1a1a"
          strokeWidth={size * 0.022}
          strokeLinecap="round"
        />
        {/* Ponteiro */}
        <Line
          x1={cx}
          y1={cy}
          x2={needleEndX}
          y2={needleEndY}
          stroke="#ffffff"
          strokeWidth={size * 0.016}
          strokeLinecap="round"
        />
        {/* Ponta do ponteiro */}
        <Circle
          cx={needleEndX}
          cy={needleEndY}
          r={size * 0.022}
          fill="#00ff88"
          stroke="#ffffff"
          strokeWidth={2}
        />
      </Svg>
      {/* Labels 0% e 100% */}
      <View
        style={{
          width: size,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: size * 0.06,
          marginTop: -size * 0.02,
        }}
      >
        <Text style={{ color: "#555", fontSize: 11, fontWeight: "700" }}>0%</Text>
        <Text style={{ color: "#555", fontSize: 11, fontWeight: "700" }}>100%</Text>
      </View>
      {/* Valor central */}
      <View style={{ alignItems: "center", marginTop: 12 }}>
        <Text style={{ color: "#00ff88", fontSize: 32, fontWeight: "800" }}>
          {Math.round(clamped)}%
        </Text>
        {label ? (
          <Text style={{ color: "#888", fontSize: 12, marginTop: 6, fontWeight: "500" }}>
            {label}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
