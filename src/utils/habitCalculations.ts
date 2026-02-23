import { format, parseISO, differenceInDays, subDays, startOfDay } from 'date-fns';
import type { CheckIn, HabitFrequency, StreakFreeze } from '@/types/habit';
import { isHabitScheduledForDate, countScheduledDaysInRange } from './frequencyUtils';

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export const getTodayDate = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export const formatDateToISO = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Helper: create a minimal habit-like object for frequency checks
 */
const makeHabitForFrequency = (frequency: HabitFrequency, createdAt?: any) => ({
  frequency,
  createdAt: createdAt || { toDate: () => new Date(2020, 0, 1) },
} as any);

/**
 * Check if a date has a streak freeze
 */
const hasFreezeForDate = (freezes: StreakFreeze[], date: string): boolean => {
  return freezes.some((f) => f.date === date);
};

/**
 * Calculate current streak from check-ins (frequency-aware + freeze-aware)
 * A streak is broken if there's a gap in consecutive scheduled days
 * Frozen days preserve the streak but don't add to the count
 */
export const calculateCurrentStreak = (
  checkIns: CheckIn[],
  frequency?: HabitFrequency,
  createdAt?: any,
  freezes: StreakFreeze[] = [],
): number => {
  if (checkIns.length === 0 && freezes.length === 0) return 0;

  const completedDates = new Set(
    checkIns.filter((c) => c.completed).map((c) => c.date)
  );

  if (completedDates.size === 0 && freezes.length === 0) return 0;

  const freq = frequency || { type: 'daily' as const };
  const habit = makeHabitForFrequency(freq, createdAt);

  let streak = 0;
  const today = startOfDay(new Date());
  let foundFirstCompletion = false;

  // Walk backwards from today up to 400 days
  for (let i = 0; i < 400; i++) {
    const checkDate = subDays(today, i);
    const dateISO = formatDateToISO(checkDate);
    const isScheduled = isHabitScheduledForDate(habit, dateISO);

    if (!isScheduled) continue; // Skip non-scheduled days

    const isCompleted = completedDates.has(dateISO);
    const isFrozen = hasFreezeForDate(freezes, dateISO);

    if (isCompleted) {
      streak++;
      foundFirstCompletion = true;
    } else if (isFrozen) {
      // Frozen day preserves streak but doesn't increment
      foundFirstCompletion = true;
    } else if (!foundFirstCompletion && i <= 1) {
      // Grace period: today (or yesterday if today isn't scheduled) can be incomplete
      continue;
    } else {
      // Gap found — streak broken
      break;
    }
  }

  return streak;
};

/**
 * Calculate longest streak from check-ins (frequency-aware + freeze-aware)
 */
export const calculateLongestStreak = (
  checkIns: CheckIn[],
  frequency?: HabitFrequency,
  createdAt?: any,
  freezes: StreakFreeze[] = [],
): number => {
  if (checkIns.length === 0) return 0;

  const completedCheckIns = checkIns.filter((c) => c.completed);
  if (completedCheckIns.length === 0) return 0;

  const freq = frequency || { type: 'daily' as const };
  const habit = makeHabitForFrequency(freq, createdAt);

  // Get all dates from first check-in to today
  const sortedDates = completedCheckIns
    .map((c) => c.date)
    .sort();

  const firstDate = parseISO(sortedDates[0]);
  const today = startOfDay(new Date());
  const totalDays = differenceInDays(today, firstDate) + 1;

  const completedDates = new Set(sortedDates);
  let longestStreak = 0;
  let currentStreak = 0;

  let checkDate = firstDate;
  for (let i = 0; i < totalDays; i++) {
    const dateISO = formatDateToISO(checkDate);
    const isScheduled = isHabitScheduledForDate(habit, dateISO);

    if (isScheduled) {
      const isCompleted = completedDates.has(dateISO);
      const isFrozen = hasFreezeForDate(freezes, dateISO);

      if (isCompleted) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (isFrozen) {
        // Frozen — streak preserved but not incremented
      } else {
        currentStreak = 0;
      }
    }

    checkDate = new Date(checkDate);
    checkDate.setDate(checkDate.getDate() + 1);
  }

  return longestStreak;
};

/**
 * Calculate total completions
 */
export const calculateTotalCompletions = (checkIns: CheckIn[]): number => {
  return checkIns.filter((c) => c.completed).length;
};

/**
 * Calculate completion rate for a given period (frequency-aware)
 */
export const calculateCompletionRate = (
  checkIns: CheckIn[],
  days: number = 30,
  frequency?: HabitFrequency,
  createdAt?: any,
): number => {
  const today = new Date();
  const startDate = subDays(today, days - 1);
  const startDateISO = formatDateToISO(startDate);
  const endDateISO = formatDateToISO(today);

  const completedDays = checkIns.filter(
    (c) => c.completed && c.date >= startDateISO && c.date <= endDateISO
  ).length;

  // Calculate scheduled days in the period
  let scheduledDays: number;
  if (frequency && frequency.type !== 'daily') {
    const habit = makeHabitForFrequency(frequency, createdAt);
    scheduledDays = countScheduledDaysInRange(habit, startDateISO, endDateISO);
  } else {
    scheduledDays = days;
  }

  if (scheduledDays === 0) return 0;
  return Math.round((completedDays / scheduledDays) * 100);
};

/**
 * Check if a habit is checked in for today
 */
export const isTodayCheckedIn = (checkIns: CheckIn[]): boolean => {
  const todayISO = getTodayDate();
  const todayCheckIn = checkIns.find((c) => c.date === todayISO);
  return todayCheckIn ? todayCheckIn.completed : false;
};

/**
 * Get today's check-in value (for quantity/duration habits)
 */
export const getTodayValue = (checkIns: CheckIn[]): number | undefined => {
  const todayISO = getTodayDate();
  const todayCheckIn = checkIns.find((c) => c.date === todayISO);
  return todayCheckIn?.value;
};

/**
 * Get check-in for a specific date
 */
export const getCheckInForDate = (checkIns: CheckIn[], date: string): CheckIn | undefined => {
  return checkIns.find((c) => c.date === date);
};

/**
 * Get last 7 days of check-ins with scheduling info
 */
export const getLast7DaysCheckIns = (
  checkIns: CheckIn[],
  frequency?: HabitFrequency,
  createdAt?: any,
): { date: string; completed: boolean; isScheduled: boolean; value?: number }[] => {
  const today = new Date();
  const last7Days = [];
  const freq = frequency || { type: 'daily' as const };
  const habit = makeHabitForFrequency(freq, createdAt);

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dateISO = formatDateToISO(date);
    const checkIn = checkIns.find((c) => c.date === dateISO);

    last7Days.push({
      date: dateISO,
      completed: checkIn ? checkIn.completed : false,
      isScheduled: isHabitScheduledForDate(habit, dateISO),
      value: checkIn?.value,
    });
  }

  return last7Days;
};

/**
 * Check if user should be able to create habits (free tier limit)
 */
export const canCreateHabit = (
  currentHabitsCount: number,
  isPremium: boolean,
  freeLimit: number = 5
): boolean => {
  if (isPremium) return true;
  return currentHabitsCount < freeLimit;
};
