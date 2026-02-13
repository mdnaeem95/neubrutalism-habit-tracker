import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Card } from '@components/ui';
import { useAuthStore } from '@store/useAuthStore';
import { useDialog } from '@/contexts/DialogContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, loading } = useAuthStore();
  const dialog = useDialog();
  const { colors, colorScheme } = useTheme();

  const handleSignup = async () => {
    try {
      await signup({ name, email, password });
    } catch (err: any) {
      dialog.alert('Signup Failed', err.message || 'Please try again');
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
              Get Started
            </Text>
            <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 15, color: colors.textMuted }}>
              Create your account and start building habits
            </Text>
          </View>

          <Card style={{ marginBottom: 24 }}>
            <View style={{ gap: 16 }}>
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

            <View style={{ marginTop: 24 }}>
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

          <View style={{ gap: 12, marginBottom: 24 }}>
            <Button variant="secondary" onPress={() => console.log('Google Sign-In')}>
              Continue with Google
            </Button>
            <Button variant="secondary" onPress={() => console.log('Apple Sign-In')}>
              Continue with Apple
            </Button>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 15, color: colors.text }}>
              Already have an account?{' '}
            </Text>
            <Link href="/(auth)/login">
              <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 15, color: colors.primary }}>
                Sign In
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
