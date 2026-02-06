/**
 * Achievements Screen
 * Displays all achievements and user's unlock progress
 */

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AchievementCard } from '@components/achievements';
import { useAuthStore } from '@store/useAuthStore';
import { getUserAchievements } from '@services/firebase/achievements';
import { getAllAchievements } from '@/constants/achievements';
import type { UserAchievement, AchievementId } from '@/types/achievement';
import { theme } from '@constants/theme';

export default function AchievementsScreen() {
  const router = useRouter();
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
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.subtitle}>
            {unlockedCount} / {totalCount} Unlocked ({progress}%)
          </Text>
        </View>

        <View style={styles.trophyContainer}>
          <Ionicons name="trophy" size={32} color="#FFD700" />
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress}%` },
            ]}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'all' && styles.filterTabActive,
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'unlocked' && styles.filterTabActive,
          ]}
          onPress={() => setFilter('unlocked')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'unlocked' && styles.filterTextActive,
            ]}
          >
            Unlocked ({unlockedCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'locked' && styles.filterTabActive,
          ]}
          onPress={() => setFilter('locked')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'locked' && styles.filterTextActive,
            ]}
          >
            Locked ({totalCount - unlockedCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Achievements List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.listContent}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading achievements...</Text>
          </View>
        ) : filteredAchievements.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={64} color="#999999" />
            <Text style={styles.emptyText}>No achievements found</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.black,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: theme.colors.black,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666666',
    marginTop: 4,
  },
  trophyContainer: {
    marginLeft: 16,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.black,
  },
  progressBarBackground: {
    height: 24,
    backgroundColor: '#E0E0E0',
    borderWidth: 3,
    borderColor: theme.colors.black,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.lime,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 3,
    borderColor: theme.colors.black,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: theme.colors.yellow,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666666',
  },
  filterTextActive: {
    fontWeight: '800',
    color: theme.colors.black,
  },
  scrollView: {
    flex: 1,
  },
  listContent: {
    padding: 24,
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666666',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666666',
    marginTop: 16,
  },
});
