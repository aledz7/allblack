import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TrendingUp, Activity, Target, Zap, Award } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Types
type TestHistory = {
  id: string;
  date: string;
  distance: number; // km
  time: string; // "mm:ss"
  pace: string; // "mm:ss/km"
  vo2max: number;
};

type TrainingZone = {
  id: string;
  name: string;
  range: string; // "60-70%"
  description: string;
  paceMin: string;
  paceMax: string;
  color: string;
};

// Mock Data
const probabilityData = {
  current: 87,
  target: 90,
  trend: 'up' as const,
};

const zones: TrainingZone[] = [
  {
    id: 'z1',
    name: 'Z1 - Regenerativa',
    range: '60-70% FCmax',
    description: 'Recuperação ativa e aquecimento',
    paceMin: '6:30',
    paceMax: '7:00',
    color: 'text-blue-400',
  },
  {
    id: 'z2',
    name: 'Z2 - Resistência',
    range: '70-80% FCmax',
    description: 'Base aeróbica e queima de gordura',
    paceMin: '5:45',
    paceMax: '6:15',
    color: 'text-primary', // Neon Green
  },
  {
    id: 'z3',
    name: 'Z3 - Tempo',
    range: '80-90% FCmax',
    description: 'Limiar aeróbico e resistência láctica',
    paceMin: '5:15',
    paceMax: '5:45',
    color: 'text-yellow-400', // Gold
  },
  {
    id: 'z4',
    name: 'Z4 - Limiar',
    range: '90-100% FCmax',
    description: 'Capacidade anaeróbica',
    paceMin: '4:45',
    paceMax: '5:15',
    color: 'text-orange-400',
  },
  {
    id: 'z5',
    name: 'Z5 - Velocidade',
    range: '100%+ FCmax',
    description: 'Potência anaeróbica e sprint',
    paceMin: '4:15',
    paceMax: '4:45',
    color: 'text-red-400', // Red
  },
];

const historyData: TestHistory[] = [
  { id: '1', date: 'Jan', distance: 5, time: '28:00', pace: '5:36', vo2max: 42 },
  { id: '2', date: 'Fev', distance: 5, time: '27:15', pace: '5:27', vo2max: 44 },
  { id: '3', date: 'Mar', distance: 5, time: '26:45', pace: '5:21', vo2max: 45 },
  { id: '4', date: 'Abr', distance: 5, time: '26:00', pace: '5:12', vo2max: 47 },
  { id: '5', date: 'Mai', distance: 5, time: '25:30', pace: '5:06', vo2max: 48 },
];

// Simple Bar Chart Component
const SimpleBarChart = ({ data, valueKey, color }: { data: any[], valueKey: string, color: string }) => {
  const maxValue = Math.max(...data.map(d => d[valueKey]));
  const minValue = Math.min(...data.map(d => d[valueKey]));
  const range = maxValue - minValue || 1;

  return (
    <View className="h-40 flex-row items-end justify-between gap-2 mt-4">
      {data.map((item, index) => {
        const normalizedValue = (item[valueKey] - minValue) / range;
        const height = 20 + (normalizedValue * 80); // Min 20%, Max 100%
        
        return (
          <View key={index} className="flex-1 items-center">
            <View 
              className={`w-full rounded-t-sm ${color}`}
              style={{ height: `${height}%`, opacity: 0.8 + (normalizedValue * 0.2) }}
            />
            <Text className="text-xs text-muted-foreground mt-2">{item.date}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default function AnalysisScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Análise</Text>
        <ThemeToggle />
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 128, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Probability Card */}
        <View className="bg-card rounded-2xl p-6 border border-border">
          <View className="flex-row items-center gap-3 mb-4">
            <Target className="text-primary" size={24} />
            <Text className="text-lg font-semibold text-foreground">Probabilidade de Meta</Text>
          </View>
          
          <View className="flex-row items-end justify-between">
            <View>
              <Text className="text-5xl font-bold text-primary">{probabilityData.current}%</Text>
              <Text className="text-muted-foreground mt-1">chance de atingir 21km em 1h50</Text>
            </View>
            <View className="bg-secondary px-3 py-1 rounded-full">
              <Text className="text-primary text-sm font-medium">Alta</Text>
            </View>
          </View>

          <View className="mt-4 pt-4 border-t border-border">
            <View className="flex-row items-center gap-2">
              <TrendingUp className="text-green-400" size={16} />
              <Text className="text-sm text-muted-foreground">
                Tendência positiva: +5% desde o último teste
              </Text>
            </View>
          </View>
        </View>

        {/* Training Zones */}
        <View>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">Zonas de Treino</Text>
            <Activity className="text-muted-foreground" size={20} />
          </View>

          <View className="gap-3">
            {zones.map((zone) => (
              <View key={zone.id} className="bg-card rounded-xl p-4 border border-border flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <View className={`w-2 h-2 rounded-full bg-current ${zone.color}`} />
                    <Text className="font-semibold text-foreground">{zone.name}</Text>
                  </View>
                  <Text className="text-sm text-muted-foreground mt-1">{zone.description}</Text>
                  <Text className="text-xs text-muted-foreground mt-1">{zone.range}</Text>
                </View>
                <View className="bg-secondary px-3 py-2 rounded-lg">
                  <Text className={`text-sm font-mono font-medium ${zone.color}`}>
                    {zone.paceMin} - {zone.paceMax}
                  </Text>
                  <Text className="text-xs text-muted-foreground text-center mt-1">min/km</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Evolution Charts */}
        <View>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">Evolução</Text>
            <Award className="text-muted-foreground" size={20} />
          </View>

          {/* VO2max Chart */}
          <View className="bg-card rounded-2xl p-5 border border-border mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-semibold text-foreground">VO₂máx (ml/kg/min)</Text>
              <Text className="text-primary font-bold">48.5</Text>
            </View>
            <SimpleBarChart 
              data={historyData} 
              valueKey="vo2max" 
              color="bg-primary" 
            />
          </View>

          {/* Pace Chart */}
          <View className="bg-card rounded-2xl p-5 border border-border mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-semibold text-foreground">Pace Médio (min/km)</Text>
              <Text className="text-yellow-400 font-bold">5:06</Text>
            </View>
            <SimpleBarChart 
              data={historyData.map(d => ({...d, paceVal: parseFloat(d.pace.replace(':', '.'))}))} 
              valueKey="paceVal" 
              color="bg-yellow-400" 
            />
          </View>

          {/* Time Chart */}
          <View className="bg-card rounded-2xl p-5 border border-border">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-semibold text-foreground">Tempo Total (min)</Text>
              <Text className="text-blue-400 font-bold">25:30</Text>
            </View>
            <SimpleBarChart 
              data={historyData.map(d => ({...d, timeVal: parseFloat(d.time.replace(':', '.'))}))} 
              valueKey="timeVal" 
              color="bg-blue-400" 
            />
          </View>
        </View>

        {/* Projection Card */}
        <View className="bg-gradient-to-r from-card to-secondary rounded-2xl p-6 border border-border">
          <View className="flex-row items-center gap-3 mb-3">
            <Zap className="text-yellow-400" size={24} />
            <Text className="text-lg font-bold text-foreground">Projeção de Maratona</Text>
          </View>
          <Text className="text-3xl font-bold text-foreground mb-2">3h 45min</Text>
          <Text className="text-muted-foreground text-sm">
            Baseado no seu VO₂máx atual e histórico de treinos nas zonas Z2-Z4.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}