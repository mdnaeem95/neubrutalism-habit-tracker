import { Timestamp } from 'firebase/firestore';

export type AchievementCategory =
  | 'streaks'
  | 'completion'
  | 'habits'
  | 'timing'
  | 'special'
  | 'premium';

export type AchievementId =
  // First Steps
  | 'first_habit'
  | 'first_checkin'

  // Streaks
  | 'streak_7'
  | 'streak_14'
  | 'streak_30'
  | 'streak_60'
  | 'streak_90'
  | 'streak_180'
  | 'streak_365'

  // Completions
  | 'completions_10'
  | 'completions_50'
  | 'completions_100'
  | 'completions_500'
  | 'completions_1000'

  // Habits
  | 'habits_5'
  | 'habits_10'
  | 'habits_20'

  // Perfect Performance
  | 'perfect_week'
  | 'perfect_month'

  // Timing
  | 'early_bird_7'
  | 'night_owl_7'

  // Special
  | 'comeback_kid'
  | 'consistency_king'

  // Premium Exclusive
  | 'premium_member'
  | 'theme_master'
  | 'note_taker';

export interface AchievementRequirement {
  type: 'streak' | 'completions' | 'habits' | 'timing' | 'special' | 'premium';
  value?: number;
  condition?: string;
}

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string; // Ionicons name
  color: string; // hex color
  category: AchievementCategory;
  requirement: AchievementRequirement;
  isPremium: boolean; // Premium-exclusive achievement
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: AchievementId;
  unlockedAt: Timestamp;
  progress?: number; // For tracking progress towards achievement
}

export interface AchievementProgress {
  achievementId: AchievementId;
  current: number;
  target: number;
  percentage: number;
}
