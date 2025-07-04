import { Ionicons } from "@expo/vector-icons"; // or any other icon library
import { Tabs } from "expo-router";

export default function _layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "index") {
            iconName = "home-outline";
          } else if (route.name === "profile") {
            iconName = "person-outline";
          } else if (route.name === "add") {
            iconName = "add-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="add" options={{ title: "Add Place" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
