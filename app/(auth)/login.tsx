import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Card } from '@components/ui';
import { useAuthStore } from '@store/useAuthStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Please check your credentials');
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
              Welcome Back
            </Text>
            <Text style={{ fontWeight: '600', fontSize: 18, color: '#000000' }}>
              Sign in to continue crushing your habits
            </Text>
          </View>

          <Card className="mb-6">
            <View className="gap-4">
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

            <View className="mt-6">
              <Button
                variant="primary"
                onPress={handleLogin}
                isLoading={loading}
                disabled={!email || !password || loading}
              >
                Sign In
              </Button>
            </View>

            <Link href="/(auth)/forgot-password" className="text-center mt-4">
              <Text style={{ fontWeight: '700', fontSize: 14, color: '#000000' }}>
                Forgot Password?
              </Text>
            </Link>
          </Card>

          <View className="gap-3 mb-6">
            <Button variant="secondary" onPress={() => console.log('Google Sign-In')}>
              Continue with Google
            </Button>
            <Button variant="secondary" onPress={() => console.log('Apple Sign-In')}>
              Continue with Apple
            </Button>
          </View>

          <View className="flex-row justify-center items-center">
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
