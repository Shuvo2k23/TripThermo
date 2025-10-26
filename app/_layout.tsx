import { Image } from "expo-image";
import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

// Wrapper component that uses the theme
function StackWithThemedHeader() {
  const { theme,isDark } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerTitle: () => (
          <Image
            source={
              isDark
                ? require("@/assets/images/1-dark.png")
                : require("@/assets/images/1.png")
            }
            style={{ width: 220, height: 50, resizeMode: "center" }}
          />
        ),
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="auth" />
      <Stack.Screen name="admin" />
      <Stack.Screen name="users" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StackWithThemedHeader />
    </ThemeProvider>
  );
}
