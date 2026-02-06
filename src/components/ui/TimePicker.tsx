/**
 * TimePicker Component
 * Neubrutalism-styled time picker for selecting reminder times
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  StyleSheet,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface TimePickerProps {
  value: string | null;          // "HH:MM" format
  onChange: (time: string | null) => void;
  label?: string;
  disabled?: boolean;
  showLock?: boolean;            // Show premium lock icon
  onLockPress?: () => void;      // Called when locked picker is pressed
  placeholder?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  disabled = false,
  showLock = false,
  onLockPress,
  placeholder = 'Set time',
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Parse "HH:MM" string to Date object
  const getDateFromTime = (timeString: string | null): Date => {
    const now = new Date();
    if (timeString) {
      const [hours, minutes] = timeString.split(':').map(Number);
      now.setHours(hours, minutes, 0, 0);
    }
    return now;
  };

  // Format Date to "HH:MM" string
  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Format for display (12-hour with AM/PM)
  const formatDisplayTime = (timeString: string | null): string => {
    if (!timeString) return placeholder;
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handlePress = () => {
    if (disabled) return;

    if (showLock && onLockPress) {
      onLockPress();
      return;
    }

    setShowPicker(true);
  };

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'set' && selectedDate) {
      onChange(formatTime(selectedDate));
    }

    if (Platform.OS === 'ios' && event.type === 'dismissed') {
      setShowPicker(false);
    }
  };

  const handleClear = () => {
    onChange(null);
  };

  const handleDone = () => {
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputRow}>
        <TouchableOpacity
          style={[
            styles.picker,
            disabled && styles.pickerDisabled,
            showLock && styles.pickerLocked,
          ]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Ionicons
            name={showLock ? 'lock-closed' : 'time-outline'}
            size={20}
            color={showLock ? '#666666' : '#000000'}
          />
          <Text
            style={[
              styles.pickerText,
              !value && styles.pickerPlaceholder,
              showLock && styles.pickerTextLocked,
            ]}
          >
            {showLock ? 'Premium' : formatDisplayTime(value)}
          </Text>
          {showLock && (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          )}
        </TouchableOpacity>

        {value && !showLock && !disabled && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Ionicons name="close-circle" size={24} color="#000000" />
          </TouchableOpacity>
        )}
      </View>

      {/* iOS Modal Picker */}
      {Platform.OS === 'ios' && showPicker && (
        <Modal
          transparent
          animationType="slide"
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={() => setShowPicker(false)}
            />
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Time</Text>
                <TouchableOpacity onPress={handleDone}>
                  <Text style={styles.modalDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={getDateFromTime(value)}
                mode="time"
                display="spinner"
                onChange={handleChange}
                style={styles.iosPicker}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Android Picker (shows automatically) */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={getDateFromTime(value)}
          mode="time"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  picker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  pickerDisabled: {
    backgroundColor: '#E5E5E5',
    opacity: 0.7,
  },
  pickerLocked: {
    backgroundColor: '#F5F5F5',
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  pickerPlaceholder: {
    color: '#666666',
    fontWeight: '600',
  },
  pickerTextLocked: {
    color: '#666666',
  },
  proBadge: {
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000000',
  },
  clearButton: {
    padding: 4,
  },
  // iOS Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 4,
    borderTopColor: '#000000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
  },
  modalCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  modalDone: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
  },
  iosPicker: {
    height: 200,
  },
});
