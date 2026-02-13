/**
 * TimePicker - Fokus Neubrutalism Time Picker Component
 * MaterialCommunityIcons, theme colors, SpaceMono font
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { colors } = useTheme();
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

  // --- Dynamic styles using theme colors ---

  const containerStyle: ViewStyle = {
    marginBottom: 16,
  };

  const labelStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontWeight: '700',
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  };

  const inputRowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  };

  const pickerStyle: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  };

  const pickerDisabledStyle: ViewStyle = {
    backgroundColor: colors.background,
    opacity: 0.7,
  };

  const pickerLockedStyle: ViewStyle = {
    backgroundColor: colors.background,
  };

  const pickerTextStyle: TextStyle = {
    flex: 1,
    fontFamily: 'SpaceMono_700Bold',
    fontWeight: '700',
    fontSize: 16,
    color: colors.text,
  };

  const pickerPlaceholderStyle: TextStyle = {
    color: colors.textMuted,
    fontFamily: 'SpaceMono_400Regular',
    fontWeight: '400',
  };

  const pickerTextLockedStyle: TextStyle = {
    color: colors.textMuted,
  };

  const proBadgeStyle: ViewStyle = {
    backgroundColor: colors.warning,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  };

  const proBadgeTextStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontWeight: '700',
    fontSize: 10,
    color: colors.text,
  };

  const clearButtonStyle: ViewStyle = {
    padding: 4,
  };

  // iOS Modal styles
  const modalContentStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderTopWidth: 2.5,
    borderTopColor: colors.border,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  };

  const modalHeaderStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  };

  const modalTitleStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontWeight: '700',
    fontSize: 18,
    color: colors.text,
  };

  const modalCancelStyle: TextStyle = {
    fontFamily: 'SpaceMono_400Regular',
    fontWeight: '400',
    fontSize: 16,
    color: colors.textMuted,
  };

  const modalDoneStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontWeight: '700',
    fontSize: 16,
    color: colors.text,
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}

      <View style={inputRowStyle}>
        <TouchableOpacity
          style={[
            pickerStyle,
            disabled && pickerDisabledStyle,
            showLock && pickerLockedStyle,
          ]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={showLock ? 'lock' : 'clock-outline'}
            size={20}
            color={showLock ? colors.textMuted : colors.text}
          />
          <Text
            style={[
              pickerTextStyle,
              !value && pickerPlaceholderStyle,
              showLock && pickerTextLockedStyle,
            ]}
          >
            {showLock ? 'Premium' : formatDisplayTime(value)}
          </Text>
          {showLock && (
            <View style={proBadgeStyle}>
              <Text style={proBadgeTextStyle}>PRO</Text>
            </View>
          )}
        </TouchableOpacity>

        {value && !showLock && !disabled && (
          <TouchableOpacity style={clearButtonStyle} onPress={handleClear}>
            <MaterialCommunityIcons name="close-circle" size={24} color={colors.text} />
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
          <View style={staticStyles.modalOverlay}>
            <TouchableOpacity
              style={staticStyles.modalBackdrop}
              activeOpacity={1}
              onPress={() => setShowPicker(false)}
            />
            <View style={modalContentStyle}>
              <View style={modalHeaderStyle}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={modalCancelStyle}>Cancel</Text>
                </TouchableOpacity>
                <Text style={modalTitleStyle}>Select Time</Text>
                <TouchableOpacity onPress={handleDone}>
                  <Text style={modalDoneStyle}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={getDateFromTime(value)}
                mode="time"
                display="spinner"
                onChange={handleChange}
                style={staticStyles.iosPicker}
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

const staticStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iosPicker: {
    height: 200,
  },
});
