import type { CheckIn, HabitWithStats } from '@/types/habit';
import type { AchievementId } from '@/types/achievement';
import { format } from 'date-fns';
import { isHabitScheduledForDate } from '@utils/frequencyUtils';

interface AchievementCheckContext {
  habits: HabitWithStats[];
  allCheckIns: CheckIn[];
  totalHabits: number;
  totalCompletions: number;
  longestStreak: number;
  isPremium: boolean;
  unlockedAchievements: AchievementId[];
  usedThemesCount?: number; // Number of unique premium themes used
}

/**
 * Check which achievements should be unlocked based on current context
 * Returns array of achievement IDs that are newly unlockable
 */
export const checkAchievements = (context: AchievementCheckContext): AchievementId[] => {
  const newAchievements: AchievementId[] = [];
  const { unlockedAchievements } = context;

  // Helper to check if already unlocked
  const isUnlocked = (id: AchievementId) => unlockedAchievements.includes(id);

  // First Steps
  if (!isUnlocked('first_habit') && context.totalHabits >= 1) {
    newAchievements.push('first_habit');
  }
  if (!isUnlocked('first_checkin') && context.totalCompletions >= 1) {
    newAchievements.push('first_checkin');
  }

  // Streaks
  if (!isUnlocked('streak_7') && context.longestStreak >= 7) {
    newAchievements.push('streak_7');
  }
  if (!isUnlocked('streak_14') && context.longestStreak >= 14) {
    newAchievements.push('streak_14');
  }
  if (!isUnlocked('streak_30') && context.longestStreak >= 30) {
    newAchievements.push('streak_30');
  }
  if (!isUnlocked('streak_60') && context.longestStreak >= 60) {
    newAchievements.push('streak_60');
  }
  if (!isUnlocked('streak_90') && context.longestStreak >= 90) {
    newAchievements.push('streak_90');
  }
  if (!isUnlocked('streak_180') && context.longestStreak >= 180) {
    newAchievements.push('streak_180');
  }
  if (!isUnlocked('streak_365') && context.longestStreak >= 365) {
    newAchievements.push('streak_365');
  }

  // Completions
  if (!isUnlocked('completions_10') && context.totalCompletions >= 10) {
    newAchievements.push('completions_10');
  }
  if (!isUnlocked('completions_50') && context.totalCompletions >= 50) {
    newAchievements.push('completions_50');
  }
  if (!isUnlocked('completions_100') && context.totalCompletions >= 100) {
    newAchievements.push('completions_100');
  }
  if (!isUnlocked('completions_500') && context.totalCompletions >= 500) {
    newAchievements.push('completions_500');
  }
  if (!isUnlocked('completions_1000') && context.totalCompletions >= 1000) {
    newAchievements.push('completions_1000');
  }

  // Habits
  if (!isUnlocked('habits_5') && context.totalHabits >= 5) {
    newAchievements.push('habits_5');
  }
  if (!isUnlocked('habits_10') && context.totalHabits >= 10) {
    newAchievements.push('habits_10');
  }
  if (!isUnlocked('habits_20') && context.totalHabits >= 20) {
    newAchievements.push('habits_20');
  }

  // Perfect Week - Check if all habits completed for last 7 days
  if (!isUnlocked('perfect_week')) {
    const hasPerfectWeek = checkPerfectWeek(context.habits, context.allCheckIns);
    if (hasPerfectWeek) {
      newAchievements.push('perfect_week');
    }
  }

  // Perfect Month - Check if all habits completed for last 30 days
  if (!isUnlocked('perfect_month')) {
    const hasPerfectMonth = checkPerfectMonth(context.habits, context.allCheckIns);
    if (hasPerfectMonth) {
      newAchievements.push('perfect_month');
    }
  }

  // Timing achievements
  if (!isUnlocked('early_bird_7')) {
    const isEarlyBird = checkEarlyBird(context.allCheckIns);
    if (isEarlyBird) {
      newAchievements.push('early_bird_7');
    }
  }

  if (!isUnlocked('night_owl_7')) {
    const isNightOwl = checkNightOwl(context.allCheckIns);
    if (isNightOwl) {
      newAchievements.push('night_owl_7');
    }
  }

  // Comeback Kid - Started new streak after breaking one
  if (!isUnlocked('comeback_kid')) {
    const isComebackKid = checkComebackKid(context.habits);
    if (isComebackKid) {
      newAchievements.push('comeback_kid');
    }
  }

  // Consistency King - 90% completion for 30 days
  if (!isUnlocked('consistency_king')) {
    const isConsistent = checkConsistency(context.habits);
    if (isConsistent) {
      newAchievements.push('consistency_king');
    }
  }

  // Premium achievements
  if (context.isPremium) {
    if (!isUnlocked('premium_member')) {
      newAchievements.push('premium_member');
    }

    // Note Taker - 10 check-ins with notes
    if (!isUnlocked('note_taker')) {
      const notesCount = context.allCheckIns.filter(
        (c) => c.note && c.note.trim().length > 0
      ).length;
      if (notesCount >= 10) {
        newAchievements.push('note_taker');
      }
    }

    // Theme Master - Try 3 different premium themes
    if (!isUnlocked('theme_master') && context.usedThemesCount && context.usedThemesCount >= 3) {
      newAchievements.push('theme_master');
    }
  }

  return newAchievements;
};

/**
 * Check if user has completed all habits for 7 consecutive days
 */
const checkPerfectWeek = (habits: HabitWithStats[], checkIns: CheckIn[]): boolean => {
  if (habits.length === 0) return false;

  const today = new Date();
  const last7Days: string[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    last7Days.push(format(date, 'yyyy-MM-dd'));
  }

  // Check if all scheduled habits have check-ins for all 7 days
  return last7Days.every((date) => {
    return habits.every((habit) => {
      // Skip if habit isn't scheduled for this date
      if (!isHabitScheduledForDate(habit as any, date)) return true;
      return checkIns.some(
        (c) => c.habitId === habit.id && c.date === date && c.completed
      );
    });
  });
};

/**
 * Check if user has completed all habits for 30 consecutive days
 */
const checkPerfectMonth = (habits: HabitWithStats[], checkIns: CheckIn[]): boolean => {
  if (habits.length === 0) return false;

  const today = new Date();
  const last30Days: string[] = [];

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    last30Days.push(format(date, 'yyyy-MM-dd'));
  }

  return last30Days.every((date) => {
    return habits.every((habit) => {
      // Skip if habit isn't scheduled for this date
      if (!isHabitScheduledForDate(habit as any, date)) return true;
      return checkIns.some(
        (c) => c.habitId === habit.id && c.date === date && c.completed
      );
    });
  });
};

/**
 * Check if user has checked in before 8 AM for 7 consecutive days
 */
const checkEarlyBird = (checkIns: CheckIn[]): boolean => {
  const today = new Date();
  const last7Days: string[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    last7Days.push(format(date, 'yyyy-MM-dd'));
  }

  return last7Days.every((date) => {
    const dayCheckIns = checkIns.filter((c) => c.date === date && c.completed);
    if (dayCheckIns.length === 0) return false;

    // Check if any check-in was created before 8 AM
    return dayCheckIns.some((c) => {
      if (!c.createdAt || typeof c.createdAt.toDate !== 'function') return false;
      const hour = c.createdAt.toDate().getHours();
      return hour < 8;
    });
  });
};

/**
 * Check if user has checked in after 8 PM for 7 consecutive days
 */
const checkNightOwl = (checkIns: CheckIn[]): boolean => {
  const today = new Date();
  const last7Days: string[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    last7Days.push(format(date, 'yyyy-MM-dd'));
  }

  return last7Days.every((date) => {
    const dayCheckIns = checkIns.filter((c) => c.date === date && c.completed);
    if (dayCheckIns.length === 0) return false;

    return dayCheckIns.some((c) => {
      if (!c.createdAt || typeof c.createdAt.toDate !== 'function') return false;
      const hour = c.createdAt.toDate().getHours();
      return hour >= 20;
    });
  });
};

/**
 * Check if user has started a new streak after breaking one
 */
const checkComebackKid = (habits: HabitWithStats[]): boolean => {
  // If any habit has a current streak > 3 AND longest streak > current streak
  // This means they had a longer streak before and came back
  return habits.some((h) => h.currentStreak >= 3 && h.longestStreak > h.currentStreak);
};

/**
 * Check if user maintains 90% completion for 30 days
 */
const checkConsistency = (habits: HabitWithStats[]): boolean => {
  // Check if any habit has 90%+ completion rate
  return habits.some((h) => h.completionRate >= 90 && h.totalCompletions >= 30);
};
