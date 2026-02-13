import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Card } from '@components/ui';
import { useAuthStore } from '@store/useAuthStore';
import { useDialog } from '@/contexts/DialogContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { sendPasswordReset, loading } = useAuthStore();
  const dialog = useDialog();
  const { colors, colorScheme } = useTheme();

  const handleResetPassword = async () => {
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err: any) {
      dialog.alert('Error', err.message || 'Failed to send reset email');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}>
          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 28, color: colors.text, marginBottom: 8 }}>
              Reset Password
            </Text>
            <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 15, color: colors.textMuted }}>
              {sent
                ? 'Check your email for reset instructions'
                : 'Enter your email to receive reset instructions'}
            </Text>
          </View>

          {!sent ? (
            <Card style={{ marginBottom: 24 }}>
              <Input
                label="Email"
                placeholder="your@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <View style={{ marginTop: 24, gap: 12 }}>
                <Button
                  variant="primary"
                  onPress={handleResetPassword}
                  isLoading={loading}
                  disabled={!email || loading}
                >
                  Send Reset Link
                </Button>
                <Button variant="secondary" onPress={() => router.back()}>
                  Back to Login
                </Button>
              </View>
            </Card>
          ) : (
            <Card style={{ marginBottom: 24 }}>
              <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 15, color: colors.text, marginBottom: 16 }}>
                We've sent password reset instructions to {email}
              </Text>
              <Button variant="primary" onPress={() => router.push('/(auth)/login')}>
                Back to Login
              </Button>
            </Card>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
