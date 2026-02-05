import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Card } from '@components/ui';
import { useAuthStore } from '@store/useAuthStore';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { sendPasswordReset, loading } = useAuthStore();

  const handleResetPassword = async () => {
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send reset email');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#F5F5F5' }}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}>
          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontWeight: '900', fontSize: 48, color: '#000000', marginBottom: 8 }}>
              Reset Password
            </Text>
            <Text style={{ fontWeight: '600', fontSize: 18, color: '#000000' }}>
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

              <View className="mt-6 gap-3">
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
              <Text style={{ fontWeight: '600', fontSize: 16, color: '#000000', marginBottom: 16 }}>
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
