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
      className="flex-1 bg-neu-gray"
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          <View className="mb-8">
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
            <Card className="mb-6">
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
            <Card className="mb-6">
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
