import { Tabs } from 'expo-router';
import { Home, Activity, BarChart2, User } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

// Enable className styling for Lucide icons
cssInterop(Home, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Activity, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(BarChart2, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(User, { className: { target: 'style', nativeStyleToProp: { color: true } } });

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000', // Pure Black
          borderTopColor: '#2a2a2a',  // Subtle border
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#00ff88', // Neon Green
        tabBarInactiveTintColor: '#666666', // Gray
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="tests"
        options={{
          title: 'Testes',
          tabBarIcon: ({ color, size }) => (
            <Activity color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Análise',
          tabBarIcon: ({ color, size }) => (
            <BarChart2 color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}