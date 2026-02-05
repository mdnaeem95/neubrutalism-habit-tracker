import { Alert, Share, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { Habit, HabitWithStats, CheckIn } from '@/types/habit';
import { format } from 'date-fns';

/**
 * Export habits data to CSV format
 */
export function exportHabitsToCSV(habits: HabitWithStats[]): string {
  const headers = [
    'ID',
    'Name',
    'Description',
    'Category',
    'Color',
    'Icon',
    'Frequency Type',
    'Created At',
    'Current Streak',
    'Longest Streak',
    'Total Completions',
    'Completion Rate',
    'Archived',
  ];

  const rows = habits.map((habit) => [
    habit.id,
    `"${habit.name.replace(/"/g, '""')}"`, // Escape quotes in name
    `"${(habit.description || '').replace(/"/g, '""')}"`, // Escape quotes in description
    habit.category,
    habit.color,
    habit.icon,
    habit.frequency.type,
    format(habit.createdAt.toDate(), 'yyyy-MM-dd HH:mm:ss'),
    habit.currentStreak.toString(),
    habit.longestStreak.toString(),
    habit.totalCompletions.toString(),
    habit.completionRate.toString(),
    habit.archived ? 'Yes' : 'No',
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  return csvContent;
}

/**
 * Export check-ins data to CSV format
 */
export function exportCheckInsToCSV(checkIns: Record<string, CheckIn[]>, habits: Habit[]): string {
  const headers = ['Check-in ID', 'Habit ID', 'Habit Name', 'Date', 'Completed', 'Created At'];

  const rows: string[][] = [];

  Object.entries(checkIns).forEach(([habitId, habitCheckIns]) => {
    const habit = habits.find((h) => h.id === habitId);
    const habitName = habit ? habit.name : 'Unknown';

    habitCheckIns.forEach((checkIn) => {
      rows.push([
        checkIn.id,
        habitId,
        `"${habitName.replace(/"/g, '""')}"`,
        checkIn.date,
        checkIn.completed ? 'Yes' : 'No',
        format(checkIn.createdAt.toDate(), 'yyyy-MM-dd HH:mm:ss'),
      ]);
    });
  });

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  return csvContent;
}

/**
 * Export habits data to JSON format
 */
export function exportHabitsToJSON(habits: HabitWithStats[]): string {
  const data = habits.map((habit) => ({
    id: habit.id,
    name: habit.name,
    description: habit.description,
    category: habit.category,
    color: habit.color,
    icon: habit.icon,
    frequency: habit.frequency,
    createdAt: format(habit.createdAt.toDate(), 'yyyy-MM-dd HH:mm:ss'),
    currentStreak: habit.currentStreak,
    longestStreak: habit.longestStreak,
    totalCompletions: habit.totalCompletions,
    completionRate: habit.completionRate,
    archived: habit.archived,
  }));

  return JSON.stringify({ habits: data }, null, 2);
}

/**
 * Export check-ins data to JSON format
 */
export function exportCheckInsToJSON(checkIns: Record<string, CheckIn[]>, habits: Habit[]): string {
  const data: Record<string, any> = {};

  Object.entries(checkIns).forEach(([habitId, habitCheckIns]) => {
    const habit = habits.find((h) => h.id === habitId);

    data[habitId] = {
      habitName: habit?.name || 'Unknown',
      checkIns: habitCheckIns.map((checkIn) => ({
        id: checkIn.id,
        date: checkIn.date,
        completed: checkIn.completed,
        createdAt: format(checkIn.createdAt.toDate(), 'yyyy-MM-dd HH:mm:ss'),
      })),
    };
  });

  return JSON.stringify({ checkIns: data }, null, 2);
}

/**
 * Export all data (habits + check-ins) to JSON
 */
export function exportAllDataToJSON(habits: HabitWithStats[], checkIns: Record<string, CheckIn[]>): string {
  const habitsData = habits.map((habit) => ({
    id: habit.id,
    name: habit.name,
    description: habit.description,
    category: habit.category,
    color: habit.color,
    icon: habit.icon,
    frequency: habit.frequency,
    createdAt: format(habit.createdAt.toDate(), 'yyyy-MM-dd HH:mm:ss'),
    currentStreak: habit.currentStreak,
    longestStreak: habit.longestStreak,
    totalCompletions: habit.totalCompletions,
    completionRate: habit.completionRate,
    archived: habit.archived,
  }));

  const checkInsData: Record<string, any> = {};

  Object.entries(checkIns).forEach(([habitId, habitCheckIns]) => {
    const habit = habits.find((h) => h.id === habitId);

    checkInsData[habitId] = {
      habitName: habit?.name || 'Unknown',
      checkIns: habitCheckIns.map((checkIn) => ({
        id: checkIn.id,
        date: checkIn.date,
        completed: checkIn.completed,
        createdAt: format(checkIn.createdAt.toDate(), 'yyyy-MM-dd HH:mm:ss'),
      })),
    };
  });

  return JSON.stringify(
    {
      exportedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      habits: habitsData,
      checkIns: checkInsData,
    },
    null,
    2
  );
}

/**
 * Share exported data using native share dialog
 */
export async function shareExportedData(
  content: string,
  filename: string,
  mimeType: string
): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      // For web, create a download link
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    // For mobile, write to file and share
    const fileSystemAny = FileSystem as any;
    const cacheDir = fileSystemAny.cacheDirectory || fileSystemAny.documentDirectory;
    if (!cacheDir) {
      throw new Error('File system not available');
    }
    const fileUri = `${cacheDir}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: fileSystemAny.EncodingType.UTF8,
    });

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType,
        dialogTitle: 'Export Block Data',
        UTI: mimeType,
      });
    } else {
      // Fallback to native Share API
      await Share.share({
        message: content,
        title: 'Block Habit Data Export',
      });
    }
  } catch (error) {
    console.error('Failed to share exported data:', error);
    throw new Error('Failed to export data. Please try again.');
  }
}

/**
 * Main export function with format selection
 */
export async function exportData(
  habits: HabitWithStats[],
  checkIns: Record<string, CheckIn[]>,
  exportFormat: 'csv' | 'json'
): Promise<void> {
  try {
    if (habits.length === 0) {
      Alert.alert('No Data', 'You have no habits to export.');
      return;
    }

    const timestamp = format(new Date(), 'yyyy-MM-dd_HHmmss');

    if (exportFormat === 'csv') {
      // Export as separate CSV files (habits and check-ins)
      const habitsCSV = exportHabitsToCSV(habits);
      const checkInsCSV = exportCheckInsToCSV(checkIns, habits);

      // For now, we'll combine them or export separately
      // Let's combine with a separator
      const combinedCSV = `HABITS\n${habitsCSV}\n\nCHECK-INS\n${checkInsCSV}`;

      await shareExportedData(
        combinedCSV,
        `block_export_${timestamp}.csv`,
        'text/csv'
      );
    } else {
      // Export as single JSON file
      const jsonData = exportAllDataToJSON(habits, checkIns);

      await shareExportedData(
        jsonData,
        `block_export_${timestamp}.json`,
        'application/json'
      );
    }

    Alert.alert('Success', 'Data exported successfully!');
  } catch (error: any) {
    Alert.alert('Export Failed', error.message || 'Failed to export data');
    throw error;
  }
}
