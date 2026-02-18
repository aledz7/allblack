import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  TrendingUp,
  Target,
  Zap,
  Droplets,
  ChevronRight,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

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

export default function HomeScreen() {
  const router = useRouter();

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

        {/* Hero Image Banner */}
        <View className="px-6 mb-6">
          <View className="relative w-full h-48 rounded-2xl overflow-hidden">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1549896869-ca27eeffe4fb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fFJ1bm5pbmclMjB0cmFjayUyMHNwcmludHxlbnwwfHwwfHx8MA%3D%3D",
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              className="absolute bottom-0 left-0 right-0 h-24 justify-end p-4"
            >
              <Text className="text-white font-bold text-lg">
                Próximo Treino
              </Text>
              <Text className="text-gray-300 text-sm">
                Hoje • 10km • Zona 2
              </Text>
            </LinearGradient>
          </View>
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

            {/* Probability Card */}
            <View className="flex-1 bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a]">
              <View className="flex-row items-center gap-2 mb-2">
                <Target size={20} color="#ffd700" />
                <Text className="text-gray-400 text-xs uppercase font-semibold">
                  Meta
                </Text>
              </View>
              <Text className="text-white text-3xl font-bold">85%</Text>
              <Text className="text-[#00ff88] text-xs mt-1 font-medium">
                Alta probabilidade
              </Text>
            </View>
          </View>
        </View>

        {/* Goal Summary */}
        <View className="px-6 mb-6">
          <View className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#2a2a2a]">
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
                <Text className="text-gray-500 text-xs mb-1">Tempo Alvo</Text>
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
        <View className="px-6 mb-6">
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
                className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a] flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: zone.color }}
                  />
                  <View>
                    <Text className="text-white font-semibold text-sm">
                      {zone.name}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      {zone.description}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-gray-300 text-sm font-mono">
                    {zone.paceRange}
                  </Text>
                  <ChevronRight size={16} color="#666" />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Hydration Tip */}
        <View className="px-6 mb-6">
          <View className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a] flex-row items-center gap-4">
            <View className="bg-[#2a2a2a] p-3 rounded-full">
              <Droplets size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-sm">
                Hidratação Recomendada
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
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
