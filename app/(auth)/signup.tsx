import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Card } from '@components/ui';
import { useAuthStore } from '@store/useAuthStore';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, loading, error } = useAuthStore();

  const handleSignup = async () => {
    try {
      await signup({ name, email, password });
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Signup Failed', err.message || 'Please try again');
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
              Get Started
            </Text>
            <Text style={{ fontWeight: '600', fontSize: 18, color: '#000000' }}>
              Create your account and start building habits
            </Text>
          </View>

          <Card className="mb-6">
            <View className="gap-4">
              <Input
                label="Name"
                placeholder="Your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
              />
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
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                helperText="Must be at least 8 characters"
                autoComplete="password-new"
              />
            </View>

            <View className="mt-6">
              <Button
                variant="primary"
                onPress={handleSignup}
                isLoading={loading}
                disabled={!name || !email || !password || password.length < 8 || loading}
              >
                Create Account
              </Button>
            </View>
          </Card>

          <View className="gap-3 mb-6">
            <Button variant="secondary" onPress={() => console.log('Google Sign-In')}>
              Continue with Google
            </Button>
            <Button variant="secondary" onPress={() => console.log('Apple Sign-In')}>
              Continue with Apple
            </Button>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontWeight: '600', fontSize: 16, color: '#000000' }}>
              Already have an account?{' '}
            </Text>
            <Link href="/(auth)/login">
              <Text style={{ fontWeight: '800', fontSize: 16, color: '#FFD700' }}>
                Sign In
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
