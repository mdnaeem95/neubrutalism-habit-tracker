import './global.css';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import { Button, Card, Input, Badge } from './src/components/ui';

export default function App() {
  return (
    <View className="flex-1 bg-neu-gray">
      <StatusBar style="dark" />
      <ScrollView className="flex-1 p-6">
        <View className="mt-12">
          <Text className="font-black text-5xl text-neu-black mb-2">
            HabitBrutal
          </Text>
          <Text className="font-extrabold text-xl text-neu-black mb-8">
            Neubrutalism UI Demo
          </Text>

          {/* Buttons Section */}
          <Card className="mb-6">
            <Text className="font-extrabold text-2xl text-neu-black mb-4">
              Buttons
            </Text>
            <View className="gap-3">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="success">Success Button</Button>
              <Button variant="danger">Danger Button</Button>
              <Button variant="primary" size="sm">
                Small Button
              </Button>
              <Button variant="primary" size="lg">
                Large Button
              </Button>
            </View>
          </Card>

          {/* Cards Section */}
          <View className="mb-6">
            <Text className="font-extrabold text-2xl text-neu-black mb-4">
              Cards
            </Text>
            <View className="gap-3">
              <Card variant="default">
                <Text className="font-bold text-base text-neu-black">
                  Default Card
                </Text>
              </Card>
              <Card variant="yellow">
                <Text className="font-bold text-base text-neu-black">
                  Yellow Card
                </Text>
              </Card>
              <Card variant="pink">
                <Text className="font-bold text-base text-neu-black">
                  Pink Card
                </Text>
              </Card>
              <Card variant="cyan">
                <Text className="font-bold text-base text-neu-black">
                  Cyan Card
                </Text>
              </Card>
              <Card variant="lime">
                <Text className="font-bold text-base text-neu-black">
                  Lime Card
                </Text>
              </Card>
            </View>
          </View>

          {/* Inputs Section */}
          <Card className="mb-6">
            <Text className="font-extrabold text-2xl text-neu-black mb-4">
              Inputs
            </Text>
            <View className="gap-4">
              <Input
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
              />
              <Input
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                helperText="Must be at least 8 characters"
              />
              <Input
                label="Error Example"
                placeholder="This has an error"
                error="This field is required"
              />
            </View>
          </Card>

          {/* Badges Section */}
          <Card className="mb-12">
            <Text className="font-extrabold text-2xl text-neu-black mb-4">
              Badges
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
