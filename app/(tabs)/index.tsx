import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@components/ui';
import { useAuthStore } from '@store/useAuthStore';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View className="flex-1 bg-neu-gray px-6 py-12">
      <StatusBar style="dark" />
      <Text style={{ fontWeight: '900', fontSize: 48, color: '#000000', marginBottom: 16 }}>
        Welcome!
      </Text>
      <Text style={{ fontWeight: '600', fontSize: 18, color: '#000000', marginBottom: 32 }}>
        {user?.displayName || user?.email}
      </Text>
      <Button variant="danger" onPress={handleLogout}>
        Sign Out
      </Button>
    </View>
  );
}
