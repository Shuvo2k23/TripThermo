import { auth, db } from "@/firebaseConfig";
import { router, Stack } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref } from "firebase/database";
import { useEffect } from "react";
import { Alert, Image } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      try {
        const userRef = ref(db, "users/" + user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          const role = userData.role;

          if (role === "admin") {
            router.replace("/admin/(tabs)");
          } else {
            router.replace("/users/(tabs)");
          }
        } else {
          router.replace("/auth/login");
        }
      } catch (error: any) {
        Alert.alert("Error", error.message);
      }
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerTitle: () => (
          <Image
            source={require("@/assets/images/1.png")}
            style={{ width: 220, height: 50, resizeMode: "center" }}
          />
        ),
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="auth" />
      <Stack.Screen name="admin" />
      <Stack.Screen name="users" />
    </Stack>
  );
}
