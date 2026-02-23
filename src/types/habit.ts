import { Timestamp } from 'firebase/firestore';

export type HabitCategory = 'health' | 'productivity' | 'fitness' | 'learning' | 'mindfulness' | 'other';

export type HabitColor = 'yellow' | 'pink' | 'cyan' | 'lime' | 'orange';

export type FrequencyType = 'daily' | 'specific_days' | 'times_per_week' | 'interval';

export interface HabitFrequency {
  type: FrequencyType;
  daysOfWeek?: number[];      // for 'specific_days': [0-6], 0 = Sunday
  timesPerWeek?: number;       // for 'times_per_week': e.g. 3
  intervalDays?: number;       // for 'interval': e.g. every 2 days
}

export type HabitTrackingType = 'boolean' | 'quantity' | 'duration';

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  icon: string; // emoji or icon name
  color: HabitColor;
  category: HabitCategory;
  frequency: HabitFrequency;
  trackingType: HabitTrackingType;
  targetValue?: number;        // goal target (e.g. 8 glasses, 30 minutes)
  unit?: string;               // e.g. 'glasses', 'pages', 'minutes', 'km'
  reminderTime: string | null; // "09:00" format
  notificationId?: string;     // Expo notification ID for cancellation
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
  value?: number;  // actual value recorded for quantity/duration habits
  note?: string; // premium feature
  createdAt: Timestamp;
}

export interface StreakFreeze {
  id: string;
  habitId: string;
  userId: string;
  date: string;        // ISO date
  type: 'auto' | 'manual';
  createdAt: Timestamp;
}

export interface HabitWithStats extends Habit {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number; // 0-100
  lastCheckIn?: CheckIn;
  todayCheckedIn: boolean;
  todayValue?: number;         // current value for today (quantity/duration)
  freezesUsedThisWeek: number;
  freezesAvailable: number;    // 1 for free, 3 for premium
}

export interface CreateHabitInput {
  name: string;
  description: string;
  icon: string;
  color: HabitColor;
  category: HabitCategory;
  frequency: HabitFrequency;
  trackingType: HabitTrackingType;
  targetValue?: number;
  unit?: string;
  reminderTime: string | null;
}

export interface UpdateHabitInput extends Partial<CreateHabitInput> {
  archived?: boolean;
}
