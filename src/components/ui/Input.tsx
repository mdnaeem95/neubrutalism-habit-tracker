import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { colors } from '@constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, style, ...props }) => {
  return (
    <View style={{ width: '100%' }}>
      {label && (
        <Text style={{ fontWeight: '800', fontSize: 16, color: '#000000', marginBottom: 8 }}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          {
            borderWidth: 3,
            borderColor: error ? '#FF0000' : '#000000',
            borderRadius: 0,
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontWeight: '600',
            fontSize: 16,
            color: '#000000',
            shadowColor: '#000000',
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 0,
          },
          style,
        ]}
        placeholderTextColor={colors.black}
        {...props}
      />
      {error && (
        <Text style={{ fontWeight: '600', fontSize: 14, color: '#FF0000', marginTop: 4 }}>
          {error}
        </Text>
      )}
      {helperText && !error && (
        <Text style={{ fontWeight: '500', fontSize: 14, color: '#666666', marginTop: 4 }}>
          {helperText}
        </Text>
      )}
    </View>
  );
};
