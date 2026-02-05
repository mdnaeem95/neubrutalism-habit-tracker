import React from 'react';
import { TextInput, View, Text, TextInputProps, ViewStyle } from 'react-native';
import { colors } from '@constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, style, ...props }) => {
  const shadowStyle: ViewStyle = {
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  };

  return (
    <View className="w-full">
      {label && (
        <Text style={{ fontWeight: "800", fontSize: 16, color: "#000", marginBottom: 8 }}>
          {label}
        </Text>
      )}

      {/* shadow belongs here */}
      <View style={shadowStyle}>
        <TextInput
          className={`
            border-3 border-neu-black rounded-none
            bg-white px-4 py-3
            font-semibold text-base text-neu-black
            ${error ? "border-neu-error" : ""}
          `}
          style={[style]} // <- no shadowStyle here
          placeholderTextColor={colors.black}
          {...props}
        />
      </View>

      {error && (
        <Text style={{ fontWeight: "600", fontSize: 14, color: "#FF0000", marginTop: 4 }}>
          {error}
        </Text>
      )}
      {helperText && error && (
        <Text style={{ fontWeight: "500", fontSize: 14, color: "#666", marginTop: 4 }}>
          {helperText}
        </Text>
      )}
    </View>
  );
};
