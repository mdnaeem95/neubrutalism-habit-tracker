import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useNotifications } from '@hooks/useNotifications';

export function NotificationPermissionBanner() {
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
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FF69B4',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
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
    fontWeight: '800',
    fontSize: 16,
    color: '#000000',
  };

  const bodyStyle: TextStyle = {
    fontWeight: '600',
    fontSize: 14,
    color: '#000000',
    marginBottom: 12,
  };

  const buttonContainerStyle: ViewStyle = {
    flexDirection: 'row',
    gap: 8,
  };

  const buttonStyle = (isPrimary: boolean): ViewStyle => ({
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: isPrimary ? '#FFD700' : '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  });

  const buttonTextStyle: TextStyle = {
    fontWeight: '700',
    fontSize: 14,
    color: '#000000',
  };

  return (
    <View style={containerStyle}>
      <View style={headerStyle}>
        <View style={titleContainerStyle}>
          <Ionicons name="notifications" size={20} color="#000000" />
          <Text style={titleStyle}>Enable Reminders</Text>
        </View>
        <TouchableOpacity onPress={handleDismiss} activeOpacity={0.7}>
          <Ionicons name="close" size={20} color="#000000" />
        </TouchableOpacity>
      </View>

      <Text style={bodyStyle}>
        Get daily reminders to keep your streaks going!
      </Text>

      <View style={buttonContainerStyle}>
        <TouchableOpacity style={buttonStyle(true)} onPress={handleEnable} activeOpacity={0.7}>
          <Text style={buttonTextStyle}>Enable</Text>
        </TouchableOpacity>
        <TouchableOpacity style={buttonStyle(false)} onPress={handleDismiss} activeOpacity={0.7}>
          <Text style={buttonTextStyle}>Later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
