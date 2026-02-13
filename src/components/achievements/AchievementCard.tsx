/**
 * Achievement Card Component
 * Displays achievement details in Fokus Neubrutalism style
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import type { Achievement } from '@/types/achievement';

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
  unlockedAt?: Date;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  unlocked,
  unlockedAt,
}) => {
  const { colors } = useTheme();

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'COMMON';
      case 'rare':
        return 'RARE';
      case 'epic':
        return 'EPIC';
      case 'legendary':
        return 'LEGENDARY';
      default:
        return 'COMMON';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return colors.accent;
      case 'rare':
        return colors.secondary;
      case 'epic':
        return colors.primary;
      case 'legendary':
        return colors.warning;
      default:
        return colors.accent;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.border, opacity: unlocked ? 1 : 0.6 }]}>
      {/* Achievement Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: unlocked ? achievement.color : colors.divider,
            borderColor: colors.border,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={achievement.icon as any}
          size={32}
          color={unlocked ? colors.text : colors.textMuted}
        />
      </View>

      {/* Achievement Info */}
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]}>{achievement.name}</Text>
          {achievement.isPremium && (
            <View style={[styles.premiumBadge, { backgroundColor: colors.warning, borderColor: colors.border }]}>
              <MaterialCommunityIcons name="star" size={10} color={colors.text} />
            </View>
          )}
        </View>

        <Text style={[styles.description, { color: colors.textMuted }]}>{achievement.description}</Text>

        {/* Rarity Badge */}
        <View
          style={[
            styles.rarityBadge,
            { backgroundColor: getRarityColor(achievement.rarity), borderColor: colors.border },
          ]}
        >
          <Text style={[styles.rarityText, { color: colors.text }]}>{getRarityLabel(achievement.rarity)}</Text>
        </View>

        {/* Unlocked Date */}
        {unlocked && unlockedAt && (
          <Text style={[styles.unlockedDate, { color: colors.accent }]}>
            Unlocked {unlockedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
        )}

        {!unlocked && (
          <View style={styles.lockedContainer}>
            <MaterialCommunityIcons name="lock" size={12} color={colors.textMuted} />
            <Text style={[styles.lockedText, { color: colors.textMuted }]}>Locked</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 2.5,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderWidth: 2.5,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontFamily: 'SpaceMono_700Bold',
    marginRight: 8,
  },
  premiumBadge: {
    borderWidth: 1.5,
    width: 20,
    height: 20,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    fontFamily: 'SpaceMono_400Regular',
    marginBottom: 8,
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2.5,
    borderRadius: 9999,
    marginBottom: 8,
  },
  rarityText: {
    fontSize: 10,
    fontFamily: 'SpaceMono_700Bold',
  },
  unlockedDate: {
    fontSize: 12,
    fontFamily: 'SpaceMono_700Bold',
  },
  lockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockedText: {
    fontSize: 12,
    fontFamily: 'SpaceMono_700Bold',
  },
});
