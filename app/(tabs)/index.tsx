import React, { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  TrendingUp,
  Target,
  Zap,
  Droplets,
  ChevronRight,
} from "lucide-react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { WorkoutCard } from "@/components/WorkoutCard";
import { GoalGauge } from "@/components/GoalGauge";
import { WEEK_WORKOUTS, getTodayWeekIndex } from "@/data/weekWorkouts";

// Types
type UserProfile = {
  name: string;
  goalDistance: string;
  goalTime: string;
  level: string;
};

type LatestTest = {
  date: string;
  distance: string;
  time: string;
  vo2max: number;
  pace: string;
};

type Zone = {
  id: string;
  name: string;
  description: string;
  paceRange: string;
  color: string;
};

// Mock Data
const userProfile: UserProfile = {
  name: "Atleta",
  goalDistance: "21 km",
  goalTime: "1h 45min",
  level: "Intermediário",
};

const latestTest: LatestTest = {
  date: "12 Out 2023",
  distance: "10 km",
  time: "48:30",
  vo2max: 48.5,
  pace: "4'51\"/km",
};

const trainingZones: Zone[] = [
  {
    id: "z1",
    name: "Z1 - Regeneração",
    description: "Conversação fácil",
    paceRange: "5:45 - 6:15",
    color: "#00ff88",
  },
  {
    id: "z2",
    name: "Z2 - Resistência",
    description: "Aeróbico leve",
    paceRange: "5:15 - 5:45",
    color: "#00cc6a",
  },
  {
    id: "z3",
    name: "Z3 - Tempo",
    description: "Limiar aeróbico",
    paceRange: "4:51 - 5:15",
    color: "#ffd700",
  },
  {
    id: "z4",
    name: "Z4 - Limiar",
    description: "Acumulação lactato",
    paceRange: "4:30 - 4:51",
    color: "#ff9500",
  },
  {
    id: "z5",
    name: "Z5 - VO2max",
    description: "Capacidade máxima",
    paceRange: "4:00 - 4:30",
    color: "#ff4444",
  },
];

// Progressão do pace médio (últimos testes) — para gráfico de linha
type PaceProgressionPoint = { date: string; pace: string };
const paceProgressionData: PaceProgressionPoint[] = [
  { date: "Jan", pace: "5:36" },
  { date: "Fev", pace: "5:27" },
  { date: "Mar", pace: "5:21" },
  { date: "Abr", pace: "5:12" },
  { date: "Mai", pace: "5:06" },
];

// Extrai km de string tipo "21 km" ou "10 km"; "12 min" retorna null
function parseKm(s: string): number | null {
  const match = s?.match(/(\d+)\s*km/i);
  return match ? parseInt(match[1], 10) : null;
}

// Converte pace "5:36" ou "4'51\"" em segundos por km
function parsePaceToSeconds(pace: string): number {
  const normalized = pace.replace(/['"]/g, ":").replace(/"/g, "");
  const parts = normalized.split(":").map((p) => parseInt(p.trim(), 10) || 0);
  if (parts.length >= 2) return parts[0] * 60 + parts[1];
  return 0;
}

const CHART_PADDING = { top: 24, right: 8, bottom: 24, left: 8 };
const CHART_HEIGHT = 160;

function PaceLineChart({ data, width }: { data: PaceProgressionPoint[]; width: number }) {
  if (!data.length) return null;
  const seconds = data.map((d) => parsePaceToSeconds(d.pace));
  const minSec = Math.min(...seconds);
  const maxSec = Math.max(...seconds);
  const rangeSec = maxSec - minSec || 1;
  const chartW = width - CHART_PADDING.left - CHART_PADDING.right;
  const chartH = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
  const stepX = data.length > 1 ? chartW / (data.length - 1) : chartW;

  const points = data.map((d, i) => {
    const sec = parsePaceToSeconds(d.pace);
    const x = CHART_PADDING.left + i * stepX;
    const y = CHART_PADDING.top + chartH - ((sec - minSec) / rangeSec) * chartH;
    return { x, y, label: d.pace, date: d.date };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <View style={{ width, height: CHART_HEIGHT + 24 }}>
      {/* Rótulos do pace em cima de cada ponto */}
      {points.map((p, i) => (
        <View
          key={`pace-${i}`}
          style={{
            position: "absolute",
            left: p.x - 24,
            top: Math.max(0, p.y - 18),
            width: 48,
            alignItems: "center",
          }}
        >
          <Text className="text-[#00ff88] text-xs font-bold" numberOfLines={1}>
            {p.label}/km
          </Text>
        </View>
      ))}
      <Svg width={width} height={CHART_HEIGHT}>
        <Path d={pathD} stroke="#00ff88" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={4} fill="#00ff88" stroke="#0a0a0a" strokeWidth={1} />
        ))}
      </Svg>
      <View style={{ flexDirection: "row", paddingHorizontal: CHART_PADDING.left, marginTop: 4 }}>
        {points.map((p, i) => (
          <Text key={i} className="text-gray-500 text-[10px]" style={{ width: stepX, textAlign: "center" }}>
            {p.date}
          </Text>
        ))}
      </View>
    </View>
  );
}

const CARD_GAP = 12;
const CARD_MIN_WIDTH = 160;
const DESKTOP_BREAKPOINT = 768;
const COMPLETED_WORKOUTS_KEY = "week_workouts_completed";

export default function HomeScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const zonesCardWidthPercent =
    screenWidth < 600 ? "95%" : screenWidth < 1024 ? "65%" : "45%";

  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const todayIndex = getTodayWeekIndex();
  const isDesktop = screenWidth >= DESKTOP_BREAKPOINT;

  // Progresso em relação à meta de distância: onde estou vs onde tenho que ir
  const goalKm = parseKm(userProfile.goalDistance);
  const currentKm = parseKm(latestTest.distance);
  const progressPercent =
    goalKm != null && goalKm > 0 && currentKm != null
      ? Math.min(100, Math.round((currentKm / goalKm) * 100))
      : 85; // fallback quando não há distância em km (ex.: teste 12 min)
  const remainingKm = goalKm != null && currentKm != null ? Math.max(0, goalKm - currentKm) : null;

  useEffect(() => {
    AsyncStorage.getItem(COMPLETED_WORKOUTS_KEY).then((raw) => {
      if (raw) {
        try {
          const ids = JSON.parse(raw) as string[];
          setCompletedIds(new Set(ids));
        } catch (_) {}
      }
    });
  }, []);

  const toggleCompleted = useCallback((id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      AsyncStorage.setItem(
        COMPLETED_WORKOUTS_KEY,
        JSON.stringify([...next])
      );
      return next;
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              All Black
            </Text>
            <Text className="text-white text-2xl font-bold mt-1">
              Olá, {userProfile.name}
            </Text>
          </View>
        </View>

        {/* Treinos da semana — horizontal: scroll no mobile, todos em linha no desktop */}
        <View className="px-6 mb-6">
          {isDesktop ? (
            <View
              className="flex-row gap-3"
              style={{ gap: CARD_GAP }}
            >
              {WEEK_WORKOUTS.map((workout, index) => (
                <WorkoutCard
                  key={workout.id}
                  dayName={workout.dayName}
                  summary={workout.summary}
                  imageUri={workout.imageUri}
                  isToday={index === todayIndex}
                  isCompleted={completedIds.has(workout.id)}
                  onToggleCompleted={() => toggleCompleted(workout.id)}
                  style={{ flex: 1 }}
                />
              ))}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingVertical: 4,
                paddingRight: CARD_GAP,
              }}
            >
              {WEEK_WORKOUTS.map((workout, index) => (
                <View
                  key={workout.id}
                  style={{
                    width: CARD_MIN_WIDTH,
                    marginRight: index < WEEK_WORKOUTS.length - 1 ? CARD_GAP : 0,
                  }}
                >
                  <WorkoutCard
                    dayName={workout.dayName}
                    summary={workout.summary}
                    imageUri={workout.imageUri}
                    isToday={index === todayIndex}
                    isCompleted={completedIds.has(workout.id)}
                    onToggleCompleted={() => toggleCompleted(workout.id)}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Stats Grid */}
        <View className="px-6 mb-6">
          <View className="flex-row gap-4">
            {/* VO2max Card */}
            <View className="flex-1 bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a]">
              <View className="flex-row items-center gap-2 mb-2">
                <Zap size={20} color="#00ff88" />
                <Text className="text-gray-400 text-xs uppercase font-semibold">
                  VO₂máx
                </Text>
              </View>
              <Text className="text-white text-3xl font-bold">
                {latestTest.vo2max}
              </Text>
              <Text className="text-gray-500 text-xs mt-1">ml/kg/min</Text>
            </View>

            {/* Meta - mesmo % do gráfico (progresso da distância) */}
            <View className="flex-1 bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a]">
              <View className="flex-row items-center gap-2 mb-2">
                <Target size={20} color="#00ff88" />
                <Text className="text-gray-400 text-xs uppercase font-semibold">
                  Meta
                </Text>
              </View>
              <Text className="text-white text-3xl font-bold">{progressPercent}%</Text>
              <Text className="text-[#00ff88] text-xs mt-1 font-medium">
                {progressPercent >= 100 ? "Meta atingida!" : "Progresso da distância"}
              </Text>
            </View>
          </View>
        </View>

        {/* Gráfico de Meta - onde estou vs onde tenho que ir */}
        <View className="px-6 mb-6">
          <View className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#2a2a2a]">
            <View className="flex-row items-center gap-2 mb-2">
              <Target size={22} color="#00ff88" />
              <Text className="text-white text-lg font-bold">Progresso da Meta</Text>
            </View>
            <GoalGauge value={progressPercent} size={200} label="Onde você está" />
            {/* Detalhe: onde estou → meta */}
            <View className="mt-5 pt-5 border-t border-[#2a2a2a]">
              <View className="flex-row items-center justify-between gap-4 mb-2">
                <View>
                  <Text className="text-gray-500 text-xs mb-1">Onde você está</Text>
                  <Text className="text-white font-bold text-lg">
                    {currentKm != null ? `${currentKm} km` : latestTest.distance}
                  </Text>
                </View>
                <Text className="text-gray-500 text-xl">→</Text>
                <View className="items-end">
                  <Text className="text-gray-500 text-xs mb-1">Meta a atingir</Text>
                  <Text className="text-[#00ff88] font-bold text-lg">{userProfile.goalDistance}</Text>
                </View>
              </View>
              {remainingKm != null && remainingKm > 0 && (
                <Text className="text-gray-400 text-sm mt-2">
                  Faltam <Text className="text-white font-semibold">{remainingKm} km</Text> para a meta.
                </Text>
              )}
              {progressPercent >= 100 && (
                <Text className="text-[#00ff88] text-sm font-semibold mt-2">Meta de distância atingida!</Text>
              )}
            </View>
          </View>
        </View>

        {/* Objetivo Principal + Zonas de Treino lado a lado */}
        <View className="px-6 mb-6 flex-row gap-4 flex-wrap">
          {/* Goal Summary */}
          <View className="flex-1 min-w-[280px]">
            <View className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#2a2a2a] h-full">
              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <Text className="text-gray-400 text-sm mb-1">
                    Objetivo Principal
                  </Text>
                  <Text className="text-white text-xl font-bold">
                    {userProfile.goalDistance}
                  </Text>
                </View>
                <View className="bg-[#2a2a2a] px-3 py-1 rounded-full">
                  <Text className="text-[#00ff88] text-xs font-bold">
                    {userProfile.level}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-4">
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm mb-2">Tempo Alvo</Text>
                  <Text className="text-white font-semibold">
                    {userProfile.goalTime}
                  </Text>
                </View>
                <View className="w-px h-8 bg-[#2a2a2a]" />
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs mb-1">
                    Pace Necessário
                  </Text>
                  <Text className="text-white font-semibold">4'58"/km</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Training Zones */}
          <View className="flex-1 min-w-[280px]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-lg font-bold">
                Zonas de Treino
              </Text>
              <TouchableOpacity>
                <Text className="text-[#00ff88] text-sm font-medium">
                  Ver todas
                </Text>
              </TouchableOpacity>
            </View>

            <View className="gap-3">
            {trainingZones.slice(0, 3).map((zone) => (
              <View
                key={zone.id}
                className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a] flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: zone.color }}
                  />
                  <View>
                    <Text className="text-white font-semibold text-sm font-mono">
                      {zone.name}
                    </Text>
                    <Text className="text-gray-500 text-xs font-mono">
                      {zone.description}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-white text-base font-bold font-mono">
                    {zone.paceRange}
                  </Text>
                  <ChevronRight size={16} color="#666" />
                </View>
              </View>
            ))}
            </View>
          </View>
        </View>

        {/* Progressão do Pace Médio — gráfico em linha */}
        <View className="px-6 mb-6">
          <View className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a]">
            <View className="flex-row items-center gap-2 mb-3">
              <Zap size={18} color="#00ff88" />
              <Text className="text-white font-semibold text-sm">Progressão do Pace Médio</Text>
            </View>
            <Text className="text-gray-400 text-xs mb-3">
              Evolução do seu pace ao longo dos últimos testes (menor = mais rápido).
            </Text>
            <PaceLineChart data={paceProgressionData} width={Math.max(0, screenWidth - 48)} />
          </View>
        </View>

        {/* Hydration Tip */}
        <View className="px-6 mb-6">
          <View className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a] flex-row items-center justify-center gap-4">
            <View className="bg-[#2a2a2a] p-3 rounded-full">
              <Droplets size={24} color="#3b82f6" />
            </View>
            <View className="items-center">
              <Text className="text-white font-semibold text-sm text-center">
                Hidratação Recomendada
              </Text>
              <Text className="text-gray-400 text-xs mt-1 text-center">
                Beba 500-750ml de água antes do treino de hoje.
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Action Button */}
        <View className="px-6 mb-8">
          <TouchableOpacity
            onPress={() => router.push("/tests")}
            className="bg-[#00ff88] rounded-2xl p-4 flex-row items-center justify-center shadow-lg shadow-[#00ff88]/20"
          >
            <TrendingUp size={20} color="#000000" strokeWidth={2.5} />
            <Text className="text-black font-bold text-base ml-2">
              Registrar Novo Teste
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
