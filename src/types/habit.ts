import { Timestamp } from 'firebase/firestore';

export type HabitCategory = 'health' | 'productivity' | 'fitness' | 'learning' | 'mindfulness' | 'other';

export type HabitColor = 'yellow' | 'pink' | 'cyan' | 'lime' | 'orange';

export type FrequencyType = 'daily' | 'weekly' | 'custom';

export interface HabitFrequency {
  type: FrequencyType;
  daysOfWeek?: number[]; // [0-6] for weekly, 0 = Sunday
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  icon: string; // emoji or icon name
  color: HabitColor;
  category: HabitCategory;
  frequency: HabitFrequency;
  reminderTime: string | null; // "09:00" format
  notificationId?: string; // Expo notification ID for cancellation
  createdAt: Timestamp;
  updatedAt: Timestamp;
  archived: boolean;
}

export interface CheckIn {
  id: string;
  habitId: string;
  userId: string;
  date: string; // ISO date "2026-02-05"
  completed: boolean;
  note?: string; // premium feature
  createdAt: Timestamp;
}

export interface HabitWithStats extends Habit {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number; // 0-100
  lastCheckIn?: CheckIn;
  todayCheckedIn: boolean;
}

export interface CreateHabitInput {
  name: string;
  description: string;
  icon: string;
  color: HabitColor;
  category: HabitCategory;
  frequency: HabitFrequency;
  reminderTime: string | null;
}

export interface UpdateHabitInput extends Partial<CreateHabitInput> {
  archived?: boolean;
}
