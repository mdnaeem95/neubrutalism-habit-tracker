/**
 * Note Input Modal - Premium Feature
 * Allows users to add notes/journal entries when checking in habits
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@constants/theme';

interface NoteInputModalProps {
  visible: boolean;
  initialNote?: string;
  onSave: (note: string) => void;
  onCancel: () => void;
  habitName: string;
}

export const NoteInputModal: React.FC<NoteInputModalProps> = ({
  visible,
  initialNote = '',
  onSave,
  onCancel,
  habitName,
}) => {
  const [note, setNote] = useState(initialNote);

  const handleSave = () => {
    onSave(note.trim());
    setNote('');
  };

  const handleCancel = () => {
    setNote(initialNote);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleCancel}
        />

        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Add Note</Text>
              <Text style={styles.subtitle}>{habitName}</Text>
            </View>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={theme.colors.black} />
            </TouchableOpacity>
          </View>

          {/* Note Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={note}
              onChangeText={setNote}
              placeholder="How did it go? Any reflections?"
              placeholderTextColor="#999999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              autoFocus
              maxLength={500}
            />
            <Text style={styles.charCount}>{note.length}/500</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonTextSecondary}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleSave}
            >
              <Ionicons name="checkmark" size={20} color={theme.colors.black} />
              <Text style={styles.buttonTextPrimary}>Save Note</Text>
            </TouchableOpacity>
          </View>

          {/* Premium Badge */}
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={14} color={theme.colors.black} />
            <Text style={styles.premiumText}>Premium Feature</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: theme.colors.white,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: theme.colors.black,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 24,
    paddingBottom: 40,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.black,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginTop: 4,
  },
  closeButton: {
    marginLeft: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 3,
    borderColor: theme.colors.black,
    padding: 16,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.black,
    backgroundColor: theme.colors.bg.secondary,
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    textAlign: 'right',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 3,
    borderColor: theme.colors.black,
    gap: 8,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.yellow,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buttonTextPrimary: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.black,
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.black,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.yellow,
    borderWidth: 2,
    borderColor: theme.colors.black,
    alignSelf: 'center',
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.black,
  },
});
