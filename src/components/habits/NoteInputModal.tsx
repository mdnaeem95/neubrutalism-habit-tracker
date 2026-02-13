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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { colors } = useTheme();

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

        <View
          style={[
            styles.modal,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.border,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.text }]}>Add Note</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>{habitName}</Text>
            </View>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Note Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.surface,
                },
              ]}
              value={note}
              onChangeText={setNote}
              placeholder="How did it go? Any reflections?"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              autoFocus
              maxLength={500}
            />
            <Text style={[styles.charCount, { color: colors.textMuted }]}>{note.length}/500</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  shadowColor: colors.border,
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 0,
                },
              ]}
              onPress={handleCancel}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: colors.accent,
                  borderColor: colors.border,
                  shadowColor: colors.border,
                  shadowOffset: { width: 4, height: 4 },
                  shadowOpacity: 1,
                  shadowRadius: 0,
                },
              ]}
              onPress={handleSave}
            >
              <MaterialCommunityIcons name="check" size={20} color={colors.text} />
              <Text style={[styles.buttonText, { color: colors.text }]}>Save Note</Text>
            </TouchableOpacity>
          </View>

          {/* Premium Badge */}
          <View
            style={[
              styles.premiumBadge,
              {
                backgroundColor: colors.warning,
                borderColor: colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons name="star" size={14} color={colors.text} />
            <Text style={[styles.premiumText, { color: colors.text }]}>Premium Feature</Text>
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
    borderTopWidth: 3.5,
    borderLeftWidth: 3.5,
    borderRightWidth: 3.5,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 40,
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
    fontFamily: 'SpaceMono_700Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'SpaceMono_400Regular',
    marginTop: 4,
  },
  closeButton: {
    marginLeft: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 2.5,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: 'SpaceMono_400Regular',
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'SpaceMono_400Regular',
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
    borderWidth: 2.5,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'SpaceMono_700Bold',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2.5,
    borderRadius: 9999,
    alignSelf: 'center',
  },
  premiumText: {
    fontSize: 12,
    fontFamily: 'SpaceMono_700Bold',
  },
});
