/**
 * Achievements Screen
 * Displays all achievements and user's unlock progress
 */

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AchievementCard } from '@components/achievements';
import { useAuthStore } from '@store/useAuthStore';
import { getUserAchievements } from '@services/firebase/achievements';
import { getAllAchievements } from '@/constants/achievements';
import { useTheme } from '@/contexts/ThemeContext';
import type { UserAchievement } from '@/types/achievement';

export default function AchievementsScreen() {
  const router = useRouter();
  const { colors, colorScheme } = useTheme();
  const { user } = useAuthStore();
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    loadAchievements();
  }, [user]);

  const loadAchievements = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const unlocked = await getUserAchievements(user.id);
      setUserAchievements(unlocked);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const allAchievements = getAllAchievements();
  const unlockedIds = userAchievements.map((ua) => ua.achievementId);

  const filteredAchievements = allAchievements.filter((achievement) => {
    const isUnlocked = unlockedIds.includes(achievement.id);

    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  const unlockedCount = unlockedIds.length;
  const totalCount = allAchievements.length;
  const progress = Math.round((unlockedCount / totalCount) * 100);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingTop: 48,
          paddingBottom: 16,
          backgroundColor: colors.surface,
          borderBottomWidth: 2.5,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 28, color: colors.text }}>
            Achievements
          </Text>
          <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
            {unlockedCount} / {totalCount} Unlocked ({progress}%)
          </Text>
        </View>

        <View style={{ marginLeft: 16 }}>
          <MaterialCommunityIcons name="trophy" size={32} color={colors.warning} />
        </View>
      </View>

      {/* Progress Bar */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingVertical: 16,
          backgroundColor: colors.surface,
          borderBottomWidth: 2.5,
          borderBottomColor: colors.border,
        }}
      >
        <View
          style={{
            height: 24,
            backgroundColor: colors.divider,
            borderWidth: 2.5,
            borderColor: colors.border,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: colors.accent,
            }}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 16, gap: 8 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 12,
            borderWidth: 2.5,
            borderColor: colors.border,
            borderRadius: 12,
            backgroundColor: filter === 'all' ? colors.warning : colors.surface,
            alignItems: 'center',
            ...(filter === 'all' ? {
              shadowColor: colors.border,
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
            } : {}),
          }}
          onPress={() => setFilter('all')}
        >
          <Text
            style={{
              fontFamily: 'SpaceMono_700Bold',
              fontSize: 12,
              color: filter === 'all' ? colors.text : colors.textMuted,
            }}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 12,
            borderWidth: 2.5,
            borderColor: colors.border,
            borderRadius: 12,
            backgroundColor: filter === 'unlocked' ? colors.warning : colors.surface,
            alignItems: 'center',
            ...(filter === 'unlocked' ? {
              shadowColor: colors.border,
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
            } : {}),
          }}
          onPress={() => setFilter('unlocked')}
        >
          <Text
            style={{
              fontFamily: 'SpaceMono_700Bold',
              fontSize: 12,
              color: filter === 'unlocked' ? colors.text : colors.textMuted,
            }}
          >
            Unlocked ({unlockedCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 12,
            borderWidth: 2.5,
            borderColor: colors.border,
            borderRadius: 12,
            backgroundColor: filter === 'locked' ? colors.warning : colors.surface,
            alignItems: 'center',
            ...(filter === 'locked' ? {
              shadowColor: colors.border,
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
            } : {}),
          }}
          onPress={() => setFilter('locked')}
        >
          <Text
            style={{
              fontFamily: 'SpaceMono_700Bold',
              fontSize: 12,
              color: filter === 'locked' ? colors.text : colors.textMuted,
            }}
          >
            Locked ({totalCount - unlockedCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Achievements List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24 }}
      >
        {loading ? (
          <View style={{ paddingVertical: 48, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 15, color: colors.textMuted }}>
              Loading achievements...
            </Text>
          </View>
        ) : filteredAchievements.length === 0 ? (
          <View style={{ paddingVertical: 48, alignItems: 'center' }}>
            <MaterialCommunityIcons name="trophy-outline" size={64} color={colors.textMuted} />
            <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 15, color: colors.textMuted, marginTop: 16 }}>
              No achievements found
            </Text>
          </View>
        ) : (
          filteredAchievements.map((achievement) => {
            const userAchievement = userAchievements.find(
              (ua) => ua.achievementId === achievement.id
            );
            const isUnlocked = !!userAchievement;

            return (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={isUnlocked}
                unlockedAt={userAchievement?.unlockedAt.toDate()}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
