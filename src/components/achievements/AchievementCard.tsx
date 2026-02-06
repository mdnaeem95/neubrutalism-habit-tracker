/**
 * Achievement Card Component
 * Displays achievement details in neubrutalism style
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@constants/theme';
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
        return '#00FF00';
      case 'rare':
        return '#00FFFF';
      case 'epic':
        return '#FF69B4';
      case 'legendary':
        return '#FFD700';
      default:
        return '#00FF00';
    }
  };

  return (
    <View style={[styles.card, { opacity: unlocked ? 1 : 0.6 }]}>
      {/* Achievement Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: unlocked ? achievement.color : '#E0E0E0',
          },
        ]}
      >
        <Ionicons
          name={achievement.icon as any}
          size={32}
          color={unlocked ? '#000000' : '#999999'}
        />
      </View>

      {/* Achievement Info */}
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.name}>{achievement.name}</Text>
          {achievement.isPremium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={10} color="#000000" />
            </View>
          )}
        </View>

        <Text style={styles.description}>{achievement.description}</Text>

        {/* Rarity Badge */}
        <View
          style={[
            styles.rarityBadge,
            { backgroundColor: getRarityColor(achievement.rarity) },
          ]}
        >
          <Text style={styles.rarityText}>{getRarityLabel(achievement.rarity)}</Text>
        </View>

        {/* Unlocked Date */}
        {unlocked && unlockedAt && (
          <Text style={styles.unlockedDate}>
            Unlocked {unlockedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
        )}

        {!unlocked && <Text style={styles.lockedText}>🔒 Locked</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderWidth: 3,
    borderColor: theme.colors.black,
    padding: 16,
    marginBottom: 12,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderWidth: 3,
    borderColor: theme.colors.black,
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
    fontWeight: '900',
    color: theme.colors.black,
    marginRight: 8,
  },
  premiumBadge: {
    backgroundColor: theme.colors.yellow,
    borderWidth: 2,
    borderColor: theme.colors.black,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: theme.colors.black,
    marginBottom: 8,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.black,
  },
  unlockedDate: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00FF00',
  },
  lockedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999999',
  },
});
