/**
 * NotificationPermissionBanner - Fokus Neubrutalism Notification Banner
 * MaterialCommunityIcons, theme colors, SpaceMono font
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@hooks/useNotifications';

export function NotificationPermissionBanner() {
  const { colors } = useTheme();
  const { hasPermission, requestPermission } = useNotifications();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if user already has permission or dismissed
  if (hasPermission || dismissed) {
    return null;
  }

  const handleEnable = async () => {
    const granted = await requestPermission();
    if (granted) {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  const containerStyle: ViewStyle = {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.primary,
    shadowColor: colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  };

  const headerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  };

  const titleContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  };

  const titleStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontWeight: '700',
    fontSize: 16,
    color: colors.text,
  };

  const bodyStyle: TextStyle = {
    fontFamily: 'SpaceMono_400Regular',
    fontWeight: '400',
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
  };

  const buttonContainerStyle: ViewStyle = {
    flexDirection: 'row',
    gap: 8,
  };

  const getButtonStyle = (isPrimary: boolean): ViewStyle => ({
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: isPrimary ? colors.warning : colors.surface,
    flex: 1,
    alignItems: 'center',
    shadowColor: colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  });

  const buttonTextStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontWeight: '700',
    fontSize: 14,
    color: colors.text,
  };

  return (
    <View style={containerStyle}>
      <View style={headerStyle}>
        <View style={titleContainerStyle}>
          <MaterialCommunityIcons name="bell" size={20} color={colors.text} />
          <Text style={titleStyle}>Enable Reminders</Text>
        </View>
        <TouchableOpacity onPress={handleDismiss} activeOpacity={0.7}>
          <MaterialCommunityIcons name="close" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <Text style={bodyStyle}>
        Get daily reminders to keep your streaks going!
      </Text>

      <View style={buttonContainerStyle}>
        <TouchableOpacity style={getButtonStyle(true)} onPress={handleEnable} activeOpacity={0.7}>
          <Text style={buttonTextStyle}>Enable</Text>
        </TouchableOpacity>
        <TouchableOpacity style={getButtonStyle(false)} onPress={handleDismiss} activeOpacity={0.7}>
          <Text style={buttonTextStyle}>Later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
