import React from 'react';
import { TextInput, View, Text, TextInputProps, ViewStyle } from 'react-native';
import { colors } from '@constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  style,
  ...props
}) => {
  const shadowStyle: ViewStyle = {
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  };

  return (
    <View className="w-full">
      {label && (
        <Text className="font-extrabold text-base text-neu-black mb-2">{label}</Text>
      )}
      <TextInput
        className={`
          border-3 border-neu-black rounded-none
          bg-white px-4 py-3
          font-semibold text-base text-neu-black
          ${error ? 'border-neu-error' : ''}
        `}
        style={[shadowStyle, style]}
        placeholderTextColor={colors.black}
        {...props}
      />
      {error && (
        <Text className="font-semibold text-sm text-neu-error mt-1">{error}</Text>
      )}
      {helperText && !error && (
        <Text className="font-medium text-sm text-gray-600 mt-1">{helperText}</Text>
      )}
    </View>
  );
};
