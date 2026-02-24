import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Check } from "lucide-react-native";

export type WorkoutCardProps = {
  dayName: string;
  summary: string;
  imageUri?: string;
  isToday?: boolean;
  isCompleted?: boolean;
  onPress?: () => void;
  onToggleCompleted?: () => void;
  style?: object;
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1549896869-ca27eeffe4fb?w=900&auto=format&fit=crop&q=60";

export function WorkoutCard({
  dayName,
  summary,
  imageUri = DEFAULT_IMAGE,
  isToday = false,
  isCompleted = false,
  onPress,
  onToggleCompleted,
  style,
}: WorkoutCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={onPress ?? onToggleCompleted}
        style={({ pressed }) => [
          styles.card,
          isToday && styles.cardToday,
          isCompleted && styles.cardCompleted,
          pressed && styles.cardPressed,
        ]}
      >
        <Image
          source={{ uri: imageUri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.85)"]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.textBlock}>
              {isToday && (
                <View style={styles.hojeBadge}>
                  <Text style={styles.hojeText}>Hoje</Text>
                </View>
              )}
              <Text style={[styles.dayName, isToday && styles.dayNameToday]} numberOfLines={1}>
                {dayName}
              </Text>
              <Text style={styles.summary} numberOfLines={1}>
                {summary}
              </Text>
            </View>
            {isCompleted && (
              <View style={styles.badge}>
                <Check size={16} color="#000" strokeWidth={2.5} />
              </View>
            )}
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 120,
    minWidth: 160,
    borderRadius: 16,
    overflow: "hidden",
  },
  cardToday: {
    borderWidth: 3,
    borderColor: "#00ff88",
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  cardCompleted: {
    opacity: 0.92,
  },
  cardPressed: {
    opacity: 0.9,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  hojeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#00ff88",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  hojeText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  dayName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  dayNameToday: {
    color: "#00ff88",
  },
  summary: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#00ff88",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
