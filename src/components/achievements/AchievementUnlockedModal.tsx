/**
 * Achievement Unlocked Modal
 * Celebration modal shown when user unlocks a new achievement
 */

import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { theme } from '@constants/theme';
import type { Achievement } from '@/types/achievement';

interface AchievementUnlockedModalProps {
  visible: boolean;
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementUnlockedModal: React.FC<AchievementUnlockedModalProps> = ({
  visible,
  achievement,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && achievement) {
      // Haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Scale animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Rotate animation for icon
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [visible, achievement]);

  if (!achievement) return null;

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-15deg', '15deg'],
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Confetti Effect (decorative) */}
          <View style={styles.confettiContainer}>
            <Ionicons name="star" size={24} color="#FFD700" />
            <Ionicons name="sparkles" size={24} color="#FF69B4" />
            <Ionicons name="trophy" size={24} color="#00FF00" />
            <Ionicons name="star" size={24} color="#00FFFF" />
          </View>

          {/* Achievement Icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                backgroundColor: achievement.color,
                transform: [{ rotate }],
              },
            ]}
          >
            <Ionicons
              name={achievement.icon as any}
              size={64}
              color="#000000"
            />
          </Animated.View>

          {/* Title */}
          <Text style={styles.title}>Achievement Unlocked!</Text>

          {/* Achievement Name */}
          <Text style={styles.achievementName}>{achievement.name}</Text>

          {/* Description */}
          <Text style={styles.description}>{achievement.description}</Text>

          {/* Rarity Badge */}
          <View style={styles.rarityBadge}>
            <Text style={styles.rarityText}>
              {achievement.rarity.toUpperCase()}
            </Text>
          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Awesome!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modal: {
    backgroundColor: theme.colors.white,
    borderWidth: 4,
    borderColor: theme.colors.black,
    padding: 32,
    alignItems: 'center',
    maxWidth: 320,
    width: '90%',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  confettiContainer: {
    position: 'absolute',
    top: -20,
    flexDirection: 'row',
    gap: 16,
  },
  confetti: {
    fontSize: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderWidth: 4,
    borderColor: theme.colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  achievementName: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 16,
    textAlign: 'center',
  },
  rarityBadge: {
    backgroundColor: theme.colors.yellow,
    borderWidth: 3,
    borderColor: theme.colors.black,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },
  rarityText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.black,
  },
  closeButton: {
    backgroundColor: theme.colors.lime,
    borderWidth: 3,
    borderColor: theme.colors.black,
    paddingVertical: 12,
    paddingHorizontal: 32,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.black,
  },
});
