import { parseISO, differenceInCalendarDays, startOfWeek, endOfWeek, eachDayOfInterval, getDay, format } from 'date-fns';
import type { Habit, HabitFrequency, CheckIn } from '@/types/habit';

const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Check if a habit is scheduled for a given date
 */
export const isHabitScheduledForDate = (
  habit: Habit,
  date: string,
  _checkIns?: CheckIn[]
): boolean => {
  const { frequency } = habit;

  switch (frequency.type) {
    case 'daily':
      return true;

    case 'specific_days': {
      const dayOfWeek = getDay(parseISO(date));
      return frequency.daysOfWeek?.includes(dayOfWeek) ?? false;
    }

    case 'times_per_week':
      // Always shows on Today — user decides which days to complete
      // But we can check if they've already met their weekly target
      return true;

    case 'interval': {
      if (!frequency.intervalDays || frequency.intervalDays <= 0) return true;
      const createdDate = habit.createdAt?.toDate?.()
        ? habit.createdAt.toDate()
        : new Date();
      const daysSinceCreation = differenceInCalendarDays(parseISO(date), createdDate);
      if (daysSinceCreation < 0) return false;
      return daysSinceCreation % frequency.intervalDays === 0;
    }

    default:
      return true;
  }
};

/**
 * Check how many times a times_per_week habit has been completed this week
 */
export const getWeeklyCompletionCount = (
  checkIns: CheckIn[],
  date: string
): number => {
  const targetDate = parseISO(date);
  const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(targetDate, { weekStartsOn: 1 });

  const weekStartISO = format(weekStart, 'yyyy-MM-dd');
  const weekEndISO = format(weekEnd, 'yyyy-MM-dd');

  return checkIns.filter(
    (c) => c.completed && c.date >= weekStartISO && c.date <= weekEndISO
  ).length;
};

/**
 * Check if a times_per_week habit has met its target for the week
 */
export const hasMetWeeklyTarget = (
  frequency: HabitFrequency,
  checkIns: CheckIn[],
  date: string
): boolean => {
  if (frequency.type !== 'times_per_week' || !frequency.timesPerWeek) return false;
  return getWeeklyCompletionCount(checkIns, date) >= frequency.timesPerWeek;
};

/**
 * Get human-readable frequency label
 */
export const getFrequencyLabel = (frequency: HabitFrequency): string => {
  switch (frequency.type) {
    case 'daily':
      return 'Daily';

    case 'specific_days': {
      if (!frequency.daysOfWeek || frequency.daysOfWeek.length === 0) return 'No days set';
      if (frequency.daysOfWeek.length === 7) return 'Daily';

      // Check for weekdays (Mon-Fri = [1,2,3,4,5])
      const weekdays = [1, 2, 3, 4, 5];
      if (
        frequency.daysOfWeek.length === 5 &&
        weekdays.every((d) => frequency.daysOfWeek!.includes(d))
      ) {
        return 'Weekdays';
      }

      // Check for weekends (Sat-Sun = [0,6])
      const weekends = [0, 6];
      if (
        frequency.daysOfWeek.length === 2 &&
        weekends.every((d) => frequency.daysOfWeek!.includes(d))
      ) {
        return 'Weekends';
      }

      return frequency.daysOfWeek
        .sort((a, b) => a - b)
        .map((d) => DAY_NAMES_SHORT[d])
        .join(', ');
    }

    case 'times_per_week':
      return `${frequency.timesPerWeek || 0}x per week`;

    case 'interval':
      if (frequency.intervalDays === 2) return 'Every other day';
      return `Every ${frequency.intervalDays || 0} days`;

    default:
      return 'Daily';
  }
};

/**
 * Get all scheduled dates in a range for a habit
 */
export const getScheduledDatesInRange = (
  habit: Habit,
  startDate: string,
  endDate: string,
): string[] => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const days = eachDayOfInterval({ start, end });

  return days
    .map((d) => format(d, 'yyyy-MM-dd'))
    .filter((dateStr) => isHabitScheduledForDate(habit, dateStr));
};

/**
 * Count scheduled days in a range
 */
export const countScheduledDaysInRange = (
  habit: Habit,
  startDate: string,
  endDate: string,
): number => {
  if (habit.frequency.type === 'times_per_week') {
    // For times_per_week, the "scheduled" count is timesPerWeek * number of weeks
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const totalDays = differenceInCalendarDays(end, start) + 1;
    const weeks = Math.ceil(totalDays / 7);
    return weeks * (habit.frequency.timesPerWeek || 1);
  }

  return getScheduledDatesInRange(habit, startDate, endDate).length;
};

/**
 * Normalize legacy frequency types to new types
 * Handles data from before the frequency update
 */
export const normalizeFrequency = (frequency: HabitFrequency): HabitFrequency => {
  if (!frequency || !frequency.type) {
    return { type: 'daily' };
  }

  // Handle legacy 'weekly' type → 'specific_days'
  if ((frequency.type as string) === 'weekly') {
    return {
      type: 'specific_days',
      daysOfWeek: frequency.daysOfWeek || [1, 2, 3, 4, 5], // default to weekdays
    };
  }

  // Handle legacy 'custom' type → 'interval'
  if ((frequency.type as string) === 'custom') {
    return {
      type: 'interval',
      intervalDays: 2, // default to every other day
    };
  }

  return frequency;
};
