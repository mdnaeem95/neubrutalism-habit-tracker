import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { AchievementId, UserAchievement } from '@/types/achievement';

const ACHIEVEMENTS_COLLECTION = 'userAchievements';

/**
 * Unlock an achievement for a user
 */
export const unlockAchievement = async (
  userId: string,
  achievementId: AchievementId
): Promise<UserAchievement> => {
  try {
    // Check if already unlocked
    const existing = await getUnlockedAchievement(userId, achievementId);
    if (existing) {
      return existing;
    }

    const docRef = await addDoc(collection(db, ACHIEVEMENTS_COLLECTION), {
      userId,
      achievementId,
      unlockedAt: Timestamp.now(),
    });

    return {
      id: docRef.id,
      userId,
      achievementId,
      unlockedAt: Timestamp.now(),
    };
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    throw error;
  }
};

/**
 * Get all unlocked achievements for a user
 */
export const getUserAchievements = async (userId: string): Promise<UserAchievement[]> => {
  try {
    const q = query(
      collection(db, ACHIEVEMENTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('unlockedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserAchievement[];
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    throw error;
  }
};

/**
 * Check if a specific achievement is unlocked
 */
export const getUnlockedAchievement = async (
  userId: string,
  achievementId: AchievementId
): Promise<UserAchievement | null> => {
  try {
    const q = query(
      collection(db, ACHIEVEMENTS_COLLECTION),
      where('userId', '==', userId),
      where('achievementId', '==', achievementId)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as UserAchievement;
  } catch (error) {
    console.error('Error checking achievement unlock:', error);
    throw error;
  }
};

/**
 * Get achievement unlock count
 */
export const getAchievementCount = async (userId: string): Promise<number> => {
  try {
    const achievements = await getUserAchievements(userId);
    return achievements.length;
  } catch (error) {
    console.error('Error getting achievement count:', error);
    return 0;
  }
};
