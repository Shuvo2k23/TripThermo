import { useTheme } from '@/app/contexts/ThemeContext';
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function _layout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text + '80', // 80% opacity
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border + '30',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: any;

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "bookmarks") {
            iconName = focused ? "bookmark" : "bookmark-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Home",
        }} 
      />
      <Tabs.Screen 
        name="bookmarks" 
        options={{ 
          title: "Bookmarks",
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Profile",
        }} 
      />
    </Tabs>
  );
}