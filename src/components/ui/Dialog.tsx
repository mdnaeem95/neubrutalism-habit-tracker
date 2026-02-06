/**
 * Neubrutalism Dialog Component
 * Custom styled dialog to replace native Alert.alert
 */

import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

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

  const getButtonStyle = (style?: DialogButton['style']) => {
    switch (style) {
      case 'destructive':
        return { backgroundColor: '#FF0000' };
      case 'cancel':
        return { backgroundColor: '#00FFFF' };
      default:
        return { backgroundColor: '#FFD700' };
    }
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
            styles.dialog,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.title}>{title}</Text>

          {message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.button, getButtonStyle(button.style)]}
                onPress={() => handleButtonPress(button)}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>{button.text}</Text>
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
  dialog: {
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#000000',
    padding: 24,
    maxWidth: 320,
    width: '90%',
    shadowColor: '#000000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    borderWidth: 3,
    borderColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
  },
});
