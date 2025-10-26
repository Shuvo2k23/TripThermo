import { auth, db } from "@/firebaseConfig";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, check role and navigate
        try {
          const snapshot = await get(ref(db, "users/" + user.uid));
          if (snapshot.exists()) {
            const data = snapshot.val();
            if (data.role === "admin") {
              // You can store a preference for admin vs user mode
              // For now, default to admin tab
              router.replace("/admin/(tabs)");
            } else {
              router.replace("/users/(tabs)");
            }
          } else {
            // No user data, sign out and go to login
            await auth.signOut();
            router.replace("/auth/login");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          await auth.signOut();
          router.replace("/auth/login");
        }
      } else {
        // No user signed in, go to login
        router.replace("/auth/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0077b6" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/icon.png")} // Replace with your logo
        style={styles.logo}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#0077b6",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
