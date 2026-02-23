import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '@components/ui';
import { useTheme } from '@/contexts/ThemeContext';

interface QuantityInputModalProps {
  visible: boolean;
  habitName: string;
  unit: string;
  targetValue?: number;
  initialValue?: number;
  onSave: (value: number, note?: string) => void;
  onCancel: () => void;
  mode: 'quantity' | 'duration';
}

export const QuantityInputModal: React.FC<QuantityInputModalProps> = ({
  visible,
  habitName,
  unit,
  targetValue,
  initialValue,
  onSave,
  onCancel,
  mode,
}) => {
  const { colors } = useTheme();
  const [value, setValue] = useState(initialValue || 0);

  const increment = mode === 'duration' ? 5 : 1;
  const maxValue = mode === 'duration' ? 600 : 9999;

  const handleSave = () => {
    onSave(value);
    setValue(0);
  };

  const handleCancel = () => {
    setValue(0);
    onCancel();
  };

  const formatValue = (v: number): string => {
    if (mode === 'duration') {
      const hours = Math.floor(v / 60);
      const mins = v % 60;
      if (hours > 0) return `${hours}h ${mins}m`;
      return `${mins}m`;
    }
    return `${v}`;
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 24,
  };

  const modalStyle: ViewStyle = {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 3.5,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 24,
    shadowColor: colors.border,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const counterButtonStyle: ViewStyle = {
    width: 56,
    height: 56,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  const valueDisplayStyle: ViewStyle = {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.warning,
    minWidth: 120,
    alignItems: 'center',
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <View style={containerStyle}>
        <View style={modalStyle}>
          <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 22, color: colors.text, marginBottom: 8, textAlign: 'center' }}>
            {habitName}
          </Text>
          <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 14, color: colors.textMuted, marginBottom: 24, textAlign: 'center' }}>
            {mode === 'duration' ? 'How long?' : `How many ${unit}?`}
          </Text>

          {/* Counter */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <TouchableOpacity
              style={counterButtonStyle}
              onPress={() => setValue(Math.max(0, value - increment))}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="minus" size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={valueDisplayStyle}>
              <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 28, color: colors.text }}>
                {formatValue(value)}
              </Text>
              {unit && mode !== 'duration' && (
                <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 12, color: colors.text }}>
                  {unit}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={counterButtonStyle}
              onPress={() => setValue(Math.min(maxValue, value + increment))}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="plus" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Target indicator */}
          {targetValue && targetValue > 0 && (
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Text style={{
                fontFamily: 'SpaceMono_700Bold',
                fontSize: 13,
                color: value >= targetValue ? colors.accent : colors.textMuted,
              }}>
                {value >= targetValue ? 'Target reached!' : `Target: ${formatValue(targetValue)} ${mode !== 'duration' ? unit : ''}`}
              </Text>
            </View>
          )}

          {/* Quick increment buttons for duration */}
          {mode === 'duration' && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
              {[5, 10, 15, 30, 60].map((mins) => (
                <TouchableOpacity
                  key={mins}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderWidth: 2,
                    borderColor: colors.border,
                    borderRadius: 8,
                    backgroundColor: value === mins ? colors.accent : colors.surface,
                  }}
                  onPress={() => setValue(mins)}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 11, color: colors.text }}>
                    {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Buttons */}
          <View style={{ gap: 8 }}>
            <Button variant="primary" onPress={handleSave} disabled={value === 0}>
              Save
            </Button>
            <Button variant="secondary" onPress={handleCancel}>
              Cancel
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
