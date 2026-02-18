import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggle } from '@/components/ThemeToggle';
import { User, Calendar, Ruler, Heart, Target, Clock, Share, Download, LogOut, ChevronRight, Settings } from 'lucide-react-native';

// Types
type PersonalInfo = {
  name: string;
  age: number;
  gender: 'M' | 'F';
  weight: number; // kg
  height: number; // cm
  restingHR: number;
  maxHR: number;
};

type GoalSettings = {
  distance: string;
  time: string;
  targetPace: string;
};

type CycleConfig = {
  currentCycle: string;
  weeksRemaining: number;
};

// Mock Data
const personalInfo: PersonalInfo = {
  name: "Atleta",
  age: 28,
  gender: 'M',
  weight: 72,
  height: 178,
  restingHR: 54,
  maxHR: 192,
};

const goalSettings: GoalSettings = {
  distance: "21 km",
  time: "1h 45min",
  targetPace: "4'58\"/km",
};

const cycleConfig: CycleConfig = {
  currentCycle: "Macro Ciclo 2",
  weeksRemaining: 4,
};

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6 flex-row items-center justify-between">
          <Text className="text-white text-2xl font-bold">Perfil</Text>
          <ThemeToggle />
        </View>

        {/* Profile Header */}
        <View className="px-6 mb-8 items-center">
          <View className="relative">
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww" }}
              className="w-24 h-24 rounded-full border-4 border-[#2a2a2a]"
            />
            <View className="absolute bottom-0 right-0 bg-[#00ff88] w-6 h-6 rounded-full border-4 border-black" />
          </View>
          <Text className="text-white text-xl font-bold mt-4">{personalInfo.name}</Text>
          <Text className="text-gray-500 text-sm mt-1">Nível Intermediário</Text>
          
          <TouchableOpacity className="mt-4 px-6 py-2 border border-[#2a2a2a] rounded-full">
            <Text className="text-[#00ff88] text-sm font-semibold">Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Info Grid */}
        <View className="px-6 mb-6">
          <Text className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Informações Pessoais</Text>
          <View className="flex-row gap-4 mb-4">
            {/* Age */}
            <View className="flex-1 bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a] items-center">
              <Calendar size={20} color="#666" className="mb-2" />
              <Text className="text-white text-2xl font-bold">{personalInfo.age}</Text>
              <Text className="text-gray-500 text-xs mt-1">Anos</Text>
            </View>
            {/* Gender */}
            <View className="flex-1 bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a] items-center">
              <User size={20} color="#666" className="mb-2" />
              <Text className="text-white text-2xl font-bold">{personalInfo.gender}</Text>
              <Text className="text-gray-500 text-xs mt-1">Gênero</Text>
            </View>
          </View>
          
          <View className="flex-row gap-4">
            {/* Weight */}
            <View className="flex-1 bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a] items-center">
              <Ruler size={20} color="#666" className="mb-2" />
              <Text className="text-white text-2xl font-bold">{personalInfo.weight}</Text>
              <Text className="text-gray-500 text-xs mt-1">Peso (kg)</Text>
            </View>
            {/* Height */}
            <View className="flex-1 bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a] items-center">
              <Ruler size={20} color="#666" className="mb-2" />
              <Text className="text-white text-2xl font-bold">{personalInfo.height}</Text>
              <Text className="text-gray-500 text-xs mt-1">Altura (cm)</Text>
            </View>
          </View>
        </View>

        {/* Heart Rates */}
        <View className="px-6 mb-6">
          <View className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#2a2a2a]">
            <View className="flex-row items-center gap-3 mb-4">
              <Heart size={24} color="#ff4444" />
              <Text className="text-white font-semibold">Frequência Cardíaca</Text>
            </View>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-gray-500 text-xs mb-1">Repouso</Text>
                <Text className="text-white text-xl font-bold">{personalInfo.restingHR} <Text className="text-sm font-normal text-gray-400">bpm</Text></Text>
              </View>
              <View className="w-px bg-[#2a2a2a]" />
              <View className="items-center">
                <Text className="text-gray-500 text-xs mb-1">Máxima</Text>
                <Text className="text-white text-xl font-bold">{personalInfo.maxHR} <Text className="text-sm font-normal text-gray-400">bpm</Text></Text>
              </View>
            </View>
          </View>
        </View>

        {/* Goals Settings */}
        <View className="px-6 mb-6">
          <Text className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Configuração de Metas</Text>
          <View className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#2a2a2a]">
            <View className="flex-row items-center gap-3 mb-4">
              <Target size={20} color="#ffd700" />
              <Text className="text-white font-semibold">Objetivo Principal</Text>
            </View>
            
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 text-sm">Distância</Text>
                <Text className="text-white font-semibold">{goalSettings.distance}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 text-sm">Tempo Alvo</Text>
                <Text className="text-white font-semibold">{goalSettings.time}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 text-sm">Pace Necessário</Text>
                <Text className="text-[#00ff88] font-semibold">{goalSettings.targetPace}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Cycle Configuration */}
        <View className="px-6 mb-6">
          <Text className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Ciclo de Treino</Text>
          <View className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#2a2a2a] flex-row justify-between items-center">
            <View>
              <Text className="text-white font-semibold">{cycleConfig.currentCycle}</Text>
              <Text className="text-gray-500 text-xs mt-1">{cycleConfig.weeksRemaining} semanas restantes</Text>
            </View>
            <TouchableOpacity className="bg-[#2a2a2a] p-2 rounded-lg">
              <Settings size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Data & Sharing */}
        <View className="px-6 mb-6">
          <Text className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Dados e Compartilhamento</Text>
          <View className="gap-3">
            <TouchableOpacity className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a] flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Download size={20} color="#00ff88" />
                <Text className="text-white font-medium">Exportar Dados (CSV)</Text>
              </View>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a] flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Share size={20} color="#3b82f6" />
                <Text className="text-white font-medium">Compartilhar Progresso</Text>
              </View>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-6 mb-8">
          <TouchableOpacity className="bg-[#1a1a1a] border border-[#ff4444] rounded-2xl p-4 flex-row items-center justify-center">
            <LogOut size={20} color="#ff4444" />
            <Text className="text-[#ff4444] font-bold text-base ml-2">Sair da Conta</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}