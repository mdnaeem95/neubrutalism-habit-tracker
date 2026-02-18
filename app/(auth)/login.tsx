import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Card } from '@components/ui';
import { useAuthStore } from '@store/useAuthStore';
import { useDialog } from '@/contexts/DialogContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();
  const dialog = useDialog();
  const { colors, colorScheme } = useTheme();

  const handleLogin = async () => {
    try {
      await login({ email, password });
    } catch (err: any) {
      dialog.alert('Login Failed', err.message || 'Please check your credentials');
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
              Welcome Back
            </Text>
            <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 15, color: colors.textMuted }}>
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
                <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 12, color: colors.textMuted }}>
                  Forgot Password?
                </Text>
              </Link>
            </View>
          </Card>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'SpaceMono_400Regular', fontSize: 15, color: colors.text }}>
              Don't have an account?{' '}
            </Text>
            <Link href="/(auth)/signup">
              <Text style={{ fontFamily: 'SpaceMono_700Bold', fontSize: 15, color: colors.primary }}>
                Sign Up
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
