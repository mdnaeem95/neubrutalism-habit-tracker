import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Card } from '@components/ui';
import { useAuthStore } from '@store/useAuthStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      // No manual navigation - let index.tsx handle redirect based on auth state
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Please check your credentials');
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
              Welcome Back
            </Text>
            <Text style={{ fontWeight: '600', fontSize: 18, color: '#000000' }}>
              Sign in to continue crushing your habits
            </Text>
          </View>

          <Card style={{ marginBottom: 24 }}>
            <View style={{ gap: 16 }}>
              <Input
                label="Email"
                placeholder="your@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <View style={{ marginTop: 24 }}>
              <Button
                variant="primary"
                onPress={handleLogin}
                isLoading={loading}
                disabled={!email || !password || loading}
              >
                Sign In
              </Button>
            </View>

            <View style={{ marginTop: 16, alignItems: 'center' }}>
              <Link href="/(auth)/forgot-password">
                <Text style={{ fontWeight: '700', fontSize: 14, color: '#000000' }}>
                  Forgot Password?
                </Text>
              </Link>
            </View>
          </Card>

          <View style={{ gap: 12, marginBottom: 24 }}>
            <Button variant="secondary" onPress={() => console.log('Google Sign-In')}>
              Continue with Google
            </Button>
            <Button variant="secondary" onPress={() => console.log('Apple Sign-In')}>
              Continue with Apple
            </Button>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontWeight: '600', fontSize: 16, color: '#000000' }}>
              Don't have an account?{' '}
            </Text>
            <Link href="/(auth)/signup">
              <Text style={{ fontWeight: '800', fontSize: 16, color: '#FFD700' }}>
                Sign Up
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
