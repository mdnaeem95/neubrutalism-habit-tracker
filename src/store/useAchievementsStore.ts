import { create } from 'zustand';
import type { Achievement, AchievementId, UserAchievement } from '@/types/achievement';
import {
  getUserAchievements,
  unlockAchievement as unlockAchievementApi,
} from '@services/firebase/achievements';
import { getAchievementById } from '@/constants/achievements';

interface AchievementsState {
  userAchievements: UserAchievement[];
  unlockedIds: AchievementId[];
  loading: boolean;
  error: string | null;
  pendingUnlocks: Achievement[]; // Achievements waiting to be shown
}

interface AchievementsActions {
  fetchUserAchievements: (userId: string) => Promise<void>;
  unlockAchievement: (userId: string, achievementId: AchievementId) => Promise<void>;
  unlockMultipleAchievements: (userId: string, achievementIds: AchievementId[]) => Promise<void>;
  getPendingUnlock: () => Achievement | null;
  clearPendingUnlock: () => void;
  isUnlocked: (achievementId: AchievementId) => boolean;
}

type AchievementsStore = AchievementsState & AchievementsActions;

export const useAchievementsStore = create<AchievementsStore>((set, get) => ({
  // Initial state
  userAchievements: [],
  unlockedIds: [],
  loading: false,
  error: null,
  pendingUnlocks: [],

  // Fetch user achievements
  fetchUserAchievements: async (userId: string) => {
    try {
      set({ loading: true, error: null });

      const achievements = await getUserAchievements(userId);
      const unlockedIds = achievements.map((a) => a.achievementId);

      set({
        userAchievements: achievements,
        unlockedIds,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Unlock a single achievement
  unlockAchievement: async (userId: string, achievementId: AchievementId) => {
    try {
      // Check if already unlocked
      if (get().unlockedIds.includes(achievementId)) {
        return;
      }

      const userAchievement = await unlockAchievementApi(userId, achievementId);

      set((state) => ({
        userAchievements: [userAchievement, ...state.userAchievements],
        unlockedIds: [achievementId, ...state.unlockedIds],
      }));

      // Add to pending unlocks for modal display
      const achievement = getAchievementById(achievementId);
      if (achievement) {
        set((state) => ({
          pendingUnlocks: [...state.pendingUnlocks, achievement],
        }));
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  // Unlock multiple achievements at once
  unlockMultipleAchievements: async (
    userId: string,
    achievementIds: AchievementId[]
  ) => {
    try {
      const { unlockedIds } = get();

      // Filter out already unlocked
      const newAchievementIds = achievementIds.filter(
        (id) => !unlockedIds.includes(id)
      );

      if (newAchievementIds.length === 0) {
        return;
      }

      // Unlock all achievements
      const userAchievements = await Promise.all(
        newAchievementIds.map((id) => unlockAchievementApi(userId, id))
      );

      set((state) => ({
        userAchievements: [...userAchievements, ...state.userAchievements],
        unlockedIds: [...newAchievementIds, ...state.unlockedIds],
      }));

      // Add to pending unlocks
      const achievements = newAchievementIds
        .map((id) => getAchievementById(id))
        .filter((a): a is Achievement => a !== undefined);

      set((state) => ({
        pendingUnlocks: [...state.pendingUnlocks, ...achievements],
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  // Get next pending achievement to show
  getPendingUnlock: () => {
    const { pendingUnlocks } = get();
    return pendingUnlocks[0] || null;
  },

  // Clear the first pending unlock
  clearPendingUnlock: () => {
    set((state) => ({
      pendingUnlocks: state.pendingUnlocks.slice(1),
    }));
  },

  // Check if achievement is unlocked
  isUnlocked: (achievementId: AchievementId) => {
    return get().unlockedIds.includes(achievementId);
  },
}));
