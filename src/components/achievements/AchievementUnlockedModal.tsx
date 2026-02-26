/**
 * Achievement Unlocked Modal
 * Celebration modal shown when user unlocks a new achievement
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import type { Achievement } from '@/types/achievement';
import { ShareCardModal, AchievementShareCard } from '@components/share';
import { useAuthStore } from '@store/useAuthStore';

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
  const { colors } = useTheme();
  const [showShareModal, setShowShareModal] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { user } = useAuthStore();

  // Check if user has premium (for watermark removal)
  const isPremium = user?.subscription?.plan === 'premium' || user?.subscription?.plan === 'trial';

  useEffect(() => {
    let scaleAnimation: Animated.CompositeAnimation | null = null;
    let rotateAnimation: Animated.CompositeAnimation | null = null;

    if (visible && achievement) {
      // Haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Scale animation
      scaleAnimation = Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      });
      scaleAnimation.start();

      // Rotate animation for icon
      rotateAnimation = Animated.sequence([
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
      ]);
      rotateAnimation.start();
    } else {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
    }

    return () => {
      scaleAnimation?.stop();
      rotateAnimation?.stop();
    };
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
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.border,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Confetti Effect (decorative) */}
          <View style={styles.confettiContainer}>
            <MaterialCommunityIcons name="star" size={24} color={colors.warning} />
            <MaterialCommunityIcons name="creation" size={24} color={colors.primary} />
            <MaterialCommunityIcons name="trophy" size={24} color={colors.accent} />
            <MaterialCommunityIcons name="star" size={24} color={colors.secondary} />
          </View>

          {/* Achievement Icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                backgroundColor: achievement.color,
                borderColor: colors.border,
                shadowColor: colors.border,
                transform: [{ rotate }],
              },
            ]}
          >
            <MaterialCommunityIcons
              name={achievement.icon as any}
              size={64}
              color={colors.text}
            />
          </Animated.View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>Achievement Unlocked!</Text>

          {/* Achievement Name */}
          <Text style={[styles.achievementName, { color: colors.text }]}>{achievement.name}</Text>

          {/* Description */}
          <Text style={[styles.description, { color: colors.textMuted }]}>{achievement.description}</Text>

          {/* Rarity Badge */}
          <View style={[styles.rarityBadge, { backgroundColor: colors.warning, borderColor: colors.border }]}>
            <Text style={[styles.rarityText, { color: colors.text }]}>
              {achievement.rarity.toUpperCase()}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: colors.secondary, borderColor: colors.border, shadowColor: colors.border }]}
              onPress={() => setShowShareModal(true)}
            >
              <MaterialCommunityIcons name="share-variant" size={20} color={colors.text} />
              <Text style={[styles.shareButtonText, { color: colors.text }]}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.accent, borderColor: colors.border, shadowColor: colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.closeButtonText, { color: colors.text }]}>Awesome!</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Share Modal */}
        {achievement && (
          <ShareCardModal
            visible={showShareModal}
            onClose={() => setShowShareModal(false)}
            title="Share Achievement"
          >
            <AchievementShareCard
              achievement={achievement}
              showWatermark={!isPremium}
            />
          </ShareCardModal>
        )}
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
    borderWidth: 3.5,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    maxWidth: 320,
    width: '90%',
    shadowOffset: { width: 6, height: 6 },
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
  iconContainer: {
    width: 120,
    height: 120,
    borderWidth: 3.5,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  title: {
    fontSize: 24,
    fontFamily: 'SpaceMono_700Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  achievementName: {
    fontSize: 20,
    fontFamily: 'SpaceMono_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'SpaceMono_400Regular',
    marginBottom: 16,
    textAlign: 'center',
  },
  rarityBadge: {
    borderWidth: 2.5,
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },
  rarityText: {
    fontSize: 12,
    fontFamily: 'SpaceMono_700Bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    borderWidth: 2.5,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  shareButtonText: {
    fontSize: 16,
    fontFamily: 'SpaceMono_700Bold',
  },
  closeButton: {
    borderWidth: 2.5,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'SpaceMono_700Bold',
  },
});
