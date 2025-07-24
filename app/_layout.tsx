import { Redirect, Stack } from "expo-router";
import { Image } from "react-native";
import '../global.css';

export default function RootLayout() {
  return (
    
    <Stack screenOptions={{
          headerTitle: () => (
            <Image
              source={require('../assets/images/1.png')}
              style={{ width: 220, height: 50, resizeMode: 'center' }}
            />
          ),headerTitleAlign: 'center',
        }}>
        <Redirect href="/auth/login" />
    </Stack>
  );
}
