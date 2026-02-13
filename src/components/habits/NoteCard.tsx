/**
 * Note Card Component - Premium Feature
 * Displays a single note/journal entry for a check-in
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { format } from 'date-fns';

interface NoteCardProps {
  note: string;
  date: string; // ISO date string
  compact?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, date, compact = false }) => {
  const { colors } = useTheme();
  const formattedDate = format(new Date(date), 'MMM d, yyyy');

  if (compact) {
    return (
      <View
        style={[
          styles.compactContainer,
          {
            backgroundColor: colors.warning,
            borderColor: colors.border,
          },
        ]}
      >
        <MaterialCommunityIcons name="text-box" size={16} color={colors.text} />
        <Text style={[styles.compactText, { color: colors.text }]} numberOfLines={1}>
          {note}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="text-box" size={20} color={colors.text} />
        <Text style={[styles.date, { color: colors.textMuted }]}>{formattedDate}</Text>
      </View>
      <Text style={[styles.noteText, { color: colors.text }]}>{note}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 2.5,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    fontFamily: 'SpaceMono_700Bold',
  },
  noteText: {
    fontSize: 15,
    fontFamily: 'SpaceMono_400Regular',
    lineHeight: 22,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2.5,
    borderRadius: 9999,
    marginTop: 8,
  },
  compactText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'SpaceMono_400Regular',
  },
});
