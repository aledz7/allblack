import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Plus, Calendar, Clock, Zap, Trash2, X, ChevronDown, Pencil } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Types
type TestResult = {
  id: string;
  distance: string; // "12 min" | "10 km"
  time: string; // "hh:mm:ss" ou "mm:ss"
  date: string;
  weight: number;
  vo2max: number;
  pace: string;
};

// Mock Data
const initialTests: TestResult[] = [
  {
    id: '1',
    distance: '10 km',
    time: '48:30',
    date: '12 Out 2023',
    weight: 72,
    vo2max: 48.5,
    pace: "4'51\"/km",
  },
  {
    id: '2',
    distance: '12 min',
    time: '12:00',
    date: '05 Set 2023',
    weight: 73,
    vo2max: 45.2,
    pace: "4'39\"/km",
  },
  {
    id: '3',
    distance: '10 km',
    time: '1:45:00',
    date: '20 Ago 2023',
    weight: 74,
    vo2max: 47.8,
    pace: "5'00\"/km",
  },
];

const distanceOptions = ['12 min', '10 km'];

export default function TestsScreen() {
  const [tests, setTests] = useState<TestResult[]>(initialTests);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    distance: '10 km',
    time: '',
    date: '',
    weight: '',
  });

  const openNewTestModal = () => {
    setEditingTestId(null);
    setFormData({ distance: '10 km', time: '', date: '', weight: '' });
    setIsModalVisible(true);
  };

  const openEditTestModal = (test: TestResult) => {
    setEditingTestId(test.id);
    setFormData({
      distance: test.distance,
      time: test.time,
      date: test.date,
      weight: String(test.weight),
    });
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingTestId(null);
    setFormData({ distance: '10 km', time: '', date: '', weight: '' });
  };

  // Distância em km para cálculos: "10 km" -> 10; "12 min" (Cooper) usa tempo fixo.
  const getDistKm = (dist: string): number => {
    if (dist === '10 km') return 10;
    if (dist === '12 min') return 2.5; // placeholder Cooper: distância percorrida em 12 min (ajustar com campo no formulário se necessário)
    return 10;
  };

  // Converte tempo em "hh:mm:ss" ou "mm:ss" para total em segundos.
  const parseTimeToSeconds = (timeStr: string): number => {
    const parts = timeStr.trim().split(':').map(Number);
    if (parts.length === 3) {
      const [h, m, s] = parts;
      return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
    }
    if (parts.length === 2) {
      const [m, s] = parts;
      return (m || 0) * 60 + (s || 0);
    }
    return 0;
  };

  // Helper: Calculate VO2max (Simplified Mock Logic based on distance/time)
  const calculateVO2max = (dist: string, timeStr: string, weight: number): number => {
    const totalSeconds = parseTimeToSeconds(timeStr);
    const totalMinutes = totalSeconds / 60;
    const distKm = getDistKm(dist);
    const pace = totalMinutes / distKm;
    const estimatedVO2 = 60 + (10 / pace) - (weight * 0.05);
    return parseFloat(estimatedVO2.toFixed(1));
  };

  const handleSaveTest = () => {
    if (!formData.time || !formData.date || !formData.weight) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const vo2max = calculateVO2max(formData.distance, formData.time, parseFloat(formData.weight));
    const totalSeconds = parseTimeToSeconds(formData.time);
    const distKm = getDistKm(formData.distance);
    const paceSeconds = totalSeconds / distKm;
    const paceMins = Math.floor(paceSeconds / 60);
    const paceSecs = Math.round(paceSeconds % 60);
    const paceStr = `${paceMins}'${paceSecs.toString().padStart(2, '0')}"`;

    const payload: TestResult = {
      id: editingTestId ?? Date.now().toString(),
      distance: formData.distance,
      time: formData.time,
      date: formData.date,
      weight: parseFloat(formData.weight),
      vo2max,
      pace: paceStr,
    };

    if (editingTestId) {
      setTests(tests.map((t) => (t.id === editingTestId ? payload : t)));
    } else {
      setTests([payload, ...tests]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    Alert.alert('Excluir Teste', 'Tem certeza que deseja excluir este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Excluir', 
        style: 'destructive',
        onPress: () => setTests(tests.filter(t => t.id !== id))
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-gray-400 text-sm font-medium uppercase tracking-wider">Histórico</Text>
            <Text className="text-white text-2xl font-bold mt-1">Meus Testes</Text>
          </View>
          <ThemeToggle />
        </View>

        {/* Summary Stats */}
        <View className="px-6 mb-6">
          <View className="flex-row gap-4">
            <View className="flex-1 bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a]">
              <Text className="text-gray-400 text-xs uppercase font-semibold mb-1">Total Testes</Text>
              <Text className="text-white text-3xl font-bold">{tests.length}</Text>
            </View>
            <View className="flex-1 bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a]">
              <Text className="text-gray-400 text-xs uppercase font-semibold mb-1">Melhor VO₂</Text>
              <Text className="text-[#00ff88] text-3xl font-bold">
                {tests.length > 0 ? Math.max(...tests.map(t => t.vo2max)).toFixed(1) : '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* Tests List */}
        <View className="px-6 gap-4">
          {tests.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-gray-500">Nenhum teste registrado ainda.</Text>
            </View>
          ) : (
            tests.map((test) => (
              <View key={test.id} className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#2a2a2a]">
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-row items-center gap-3">
                    <View className="bg-[#2a2a2a] px-3 py-1 rounded-lg">
                      <Text className="text-white font-bold">{test.distance}</Text>
                    </View>
                    <Text className="text-gray-400 text-sm">{test.date}</Text>
                  </View>
                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={() => openEditTestModal(test)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                      <Pencil size={20} color="#00ff88" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(test.id)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                      <Trash2 size={20} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="flex-row gap-6">
                  <View>
                    <Text className="text-gray-500 text-xs mb-1">Tempo</Text>
                    <View className="flex-row items-center gap-1">
                      <Clock size={16} color="#fff" />
                      <Text className="text-white font-semibold text-lg">{test.time}</Text>
                    </View>
                  </View>
                  
                  <View>
                    <Text className="text-gray-500 text-xs mb-1">Pace</Text>
                    <Text className="text-white font-semibold text-lg">{test.pace}</Text>
                  </View>

                  <View>
                    <Text className="text-gray-500 text-xs mb-1">VO₂máx</Text>
                    <View className="flex-row items-center gap-1">
                      <Zap size={16} color="#00ff88" />
                      <Text className="text-[#00ff88] font-bold text-lg">{test.vo2max}</Text>
                    </View>
                  </View>
                </View>

                <View className="mt-4 pt-4 border-t border-[#2a2a2a]">
                  <Text className="text-gray-500 text-xs">Peso no dia: <Text className="text-gray-300">{test.weight} kg</Text></Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-24 right-6 bg-[#00ff88] rounded-full p-4 shadow-lg shadow-[#00ff88]/30"
        onPress={openNewTestModal}
      >
        <Plus size={28} color="#000000" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Add Test Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-[#1a1a1a] rounded-t-3xl p-6 border-t border-[#2a2a2a]" style={{ paddingBottom: 40 }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-xl font-bold">Novo Teste</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View className="gap-5">
              {/* Distance Selector */}
              <View>
                <Text className="text-gray-400 text-sm mb-2 font-medium">Distância</Text>
                <View className="flex-row gap-2">
                  {distanceOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => setFormData({ ...formData, distance: opt })}
                      className={`flex-1 py-3 rounded-xl border ${
                        formData.distance === opt 
                          ? 'bg-[#00ff88] border-[#00ff88]' 
                          : 'bg-[#2a2a2a] border-[#3a3a3a]'
                      }`}
                    >
                      <Text className={`text-center font-bold ${
                        formData.distance === opt ? 'text-black' : 'text-white'
                      }`}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Time Input */}
              <View>
                <Text className="text-gray-400 text-sm mb-2 font-medium">Tempo (hh:mm:ss ou mm:ss)</Text>
                <TextInput
                  className="bg-[#2a2a2a] text-white rounded-xl px-4 py-3 border border-[#3a3a3a] text-lg"
                  placeholder="Ex: 1:48:30 ou 48:30"
                  placeholderTextColor="#666"
                  value={formData.time}
                  onChangeText={(text) => setFormData({ ...formData, time: text })}
                />
              </View>

              {/* Date Input */}
              <View>
                <Text className="text-gray-400 text-sm mb-2 font-medium">Data</Text>
                <TextInput
                  className="bg-[#2a2a2a] text-white rounded-xl px-4 py-3 border border-[#3a3a3a] text-lg"
                  placeholder="Ex: 12 Out 2023"
                  placeholderTextColor="#666"
                  value={formData.date}
                  onChangeText={(text) => setFormData({ ...formData, date: text })}
                />
              </View>

              {/* Weight Input */}
              <View>
                <Text className="text-gray-400 text-sm mb-2 font-medium">Peso (kg)</Text>
                <TextInput
                  className="bg-[#2a2a2a] text-white rounded-xl px-4 py-3 border border-[#3a3a3a] text-lg"
                  placeholder="Ex: 72"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  value={formData.weight}
                  onChangeText={(text) => setFormData({ ...formData, weight: text })}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity 
                onPress={handleSaveTest}
                className="mt-4"
              >
                <LinearGradient
                  colors={['#00ff88', '#00cc6a']}
                  className="rounded-xl py-4 items-center"
                >
                  <Text className="text-black font-bold text-lg">
                    {editingTestId ? 'Salvar alterações' : 'Salvar Teste'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}