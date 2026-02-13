/**
 * NeuInput - Fokus Neubrutalism Input Component
 * Clean input with bold borders, small shadow, SpaceMono font
 */

import React from 'react';
import { TextInput, View, Text, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface NeuInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export const NeuInput: React.FC<NeuInputProps> = ({
  label,
  error,
  helperText,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  const containerStyle: ViewStyle = {
    width: '100%',
  };

  const labelStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontWeight: '700',
    fontSize: 15,
    color: colors.text,
    marginBottom: 8,
  };

  const inputStyle: TextStyle = {
    borderWidth: 2.5,
    borderColor: error ? colors.error : colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'SpaceMono_400Regular',
    fontWeight: '400',
    fontSize: 15,
    color: colors.text,
    shadowColor: colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  };

  const errorStyle: TextStyle = {
    fontFamily: 'SpaceMono_400Regular',
    fontWeight: '400',
    fontSize: 14,
    color: colors.error,
    marginTop: 4,
  };

  const helperStyle: TextStyle = {
    fontFamily: 'SpaceMono_400Regular',
    fontWeight: '400',
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <TextInput
        style={[inputStyle, style]}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
      {error && <Text style={errorStyle}>{error}</Text>}
      {helperText && !error && <Text style={helperStyle}>{helperText}</Text>}
    </View>
  );
};

/** @deprecated Use NeuInput instead */
export const Input = NeuInput;
