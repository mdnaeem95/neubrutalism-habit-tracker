/**
 * Dialog - Fokus Neubrutalism Dialog Component
 * Modal dialog with thick borders, large shadow, SpaceMono font
 */

import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export interface DialogButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

interface DialogProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: DialogButton[];
  onClose: () => void;
}

export const Dialog: React.FC<DialogProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  onClose,
}) => {
  const { colors } = useTheme();
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  const handleButtonPress = (button: DialogButton) => {
    button.onPress?.();
    onClose();
  };

  const getButtonBackgroundColor = (style?: DialogButton['style']): string => {
    switch (style) {
      case 'destructive':
        return colors.error;
      case 'cancel':
        return colors.secondary;
      default:
        return colors.primary;
    }
  };

  const dialogStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderWidth: 3.5,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 24,
    maxWidth: 320,
    width: '90%',
    shadowColor: colors.border,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  };

  const titleStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontWeight: '700',
    fontSize: 24,
    color: colors.text,
    marginBottom: 12,
  };

  const messageStyle: TextStyle = {
    fontFamily: 'SpaceMono_400Regular',
    fontWeight: '400',
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: 24,
    lineHeight: 22,
  };

  const buttonStyle = (btnStyle?: DialogButton['style']): ViewStyle => ({
    borderWidth: 2.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: getButtonBackgroundColor(btnStyle),
    shadowColor: colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  });

  const buttonTextStyle: TextStyle = {
    fontFamily: 'SpaceMono_700Bold',
    fontWeight: '700',
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            dialogStyle,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={titleStyle}>{title}</Text>

          {message && <Text style={messageStyle}>{message}</Text>}

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={buttonStyle(button.style)}
                onPress={() => handleButtonPress(button)}
                activeOpacity={0.8}
              >
                <Text style={buttonTextStyle}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  buttonContainer: {
    gap: 12,
  },
});
