import { format, parseISO, differenceInDays, subDays, startOfDay } from 'date-fns';
import type { CheckIn } from '@/types/habit';

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
 * Calculate current streak from check-ins
 * A streak is broken if there's a gap in consecutive days
 */
export const calculateCurrentStreak = (checkIns: CheckIn[]): number => {
  if (checkIns.length === 0) return 0;

  // Sort check-ins by date descending (most recent first)
  const sortedCheckIns = [...checkIns]
    .filter((c) => c.completed)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (sortedCheckIns.length === 0) return 0;

  let streak = 0;
  const today = startOfDay(new Date());
  let currentDate = today;

  // Check if today is completed
  const todayISO = formatDateToISO(today);
  const todayCheckIn = sortedCheckIns.find((c) => c.date === todayISO);

  if (todayCheckIn) {
    streak = 1;
    currentDate = subDays(today, 1);
  } else {
    // If today is not completed, check yesterday
    const yesterdayISO = formatDateToISO(subDays(today, 1));
    const yesterdayCheckIn = sortedCheckIns.find((c) => c.date === yesterdayISO);

    if (!yesterdayCheckIn) {
      return 0; // Streak is broken
    }

    streak = 1;
    currentDate = subDays(today, 2);
  }

  // Count consecutive days going backwards
  for (let i = 0; i < sortedCheckIns.length; i++) {
    const expectedDate = formatDateToISO(currentDate);

    if (sortedCheckIns[i].date === expectedDate) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else if (sortedCheckIns[i].date < expectedDate) {
      // Gap found, streak is broken
      break;
    }
  }

  return streak;
};

/**
 * Calculate longest streak from check-ins
 */
export const calculateLongestStreak = (checkIns: CheckIn[]): number => {
  if (checkIns.length === 0) return 0;

  const sortedCheckIns = [...checkIns]
    .filter((c) => c.completed)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (sortedCheckIns.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedCheckIns.length; i++) {
    const prevDate = parseISO(sortedCheckIns[i - 1].date);
    const currentDate = parseISO(sortedCheckIns[i].date);
    const dayDiff = differenceInDays(currentDate, prevDate);

    if (dayDiff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
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
 * Calculate completion rate for a given period (last N days)
 */
export const calculateCompletionRate = (checkIns: CheckIn[], days: number = 30): number => {
  const today = new Date();
  const startDate = subDays(today, days - 1);
  const startDateISO = formatDateToISO(startDate);

  const recentCheckIns = checkIns.filter((c) => c.date >= startDateISO);
  const completedDays = recentCheckIns.filter((c) => c.completed).length;

  return Math.round((completedDays / days) * 100);
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
 * Get check-in for a specific date
 */
export const getCheckInForDate = (checkIns: CheckIn[], date: string): CheckIn | undefined => {
  return checkIns.find((c) => c.date === date);
};

/**
 * Get last 7 days of check-ins for calendar view
 */
export const getLast7DaysCheckIns = (checkIns: CheckIn[]): { date: string; completed: boolean }[] => {
  const today = new Date();
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dateISO = formatDateToISO(date);
    const checkIn = checkIns.find((c) => c.date === dateISO);

    last7Days.push({
      date: dateISO,
      completed: checkIn ? checkIn.completed : false,
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
