// app/screens/login.tsx
import { auth, db } from "@/firebaseConfig";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { get, ref } from "firebase/database";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styles from "../../assets/css/login";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Please enter both email and password.");
    return;
  }

  setLoading(true);
  Keyboard.dismiss();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    const user = auth.currentUser;

    if (user && !user.emailVerified) {
      Alert.alert("Email Not Verified", "Please verify your email before logging in.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User not found.");
      return;
    }

    const userRef = ref(db, "users/" + user.uid);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const role = userData.role;

      // ✅ Cache user info
      await AsyncStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        role: role,
        ...userData, // any other data from DB
      }));

      // 🔁 Redirect
      if (role === "admin") {
        router.replace("/admin/(tabs)");
      } else {
        router.replace("/users/(tabs)");
      }
    } else {
      Alert.alert("Error", "User data not found in database.");
    }
  } catch (error: any) {
    Alert.alert("Login Failed", error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Log In</Text>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            onChangeText={setEmail}
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            onChangeText={setPassword}
          />

          <View style={styles.loginButton}>
            <Button title="Log In" onPress={handleLogin} color="#4F46E5" />
          </View>

          <Text style={styles.signupPrompt}>
            Don't have an account?{" "}
            <Text
              style={{ color: "#10B981" }}
              onPress={() => router.replace("/auth/signup")}
            >
              Sign Up
            </Text>
          </Text>
          <Text
            style={{ color: "red", textAlign: "center", marginTop: 15 }}
            onPress={() => router.push("/auth/forgot")}
          >
            Forgot Password?
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
