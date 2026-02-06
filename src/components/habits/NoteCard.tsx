/**
 * Note Card Component - Premium Feature
 * Displays a single note/journal entry for a check-in
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@constants/theme';
import { format } from 'date-fns';

interface NoteCardProps {
  note: string;
  date: string; // ISO date string
  compact?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, date, compact = false }) => {
  const formattedDate = format(new Date(date), 'MMM d, yyyy');

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Ionicons name="document-text" size={16} color={theme.colors.black} />
        <Text style={styles.compactText} numberOfLines={1}>
          {note}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="document-text" size={20} color={theme.colors.black} />
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <Text style={styles.noteText}>{note}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 3,
    borderColor: theme.colors.black,
    padding: 16,
    marginBottom: 12,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666666',
  },
  noteText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.black,
    lineHeight: 22,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.yellow,
    borderWidth: 2,
    borderColor: theme.colors.black,
    marginTop: 8,
  },
  compactText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.black,
  },
});
