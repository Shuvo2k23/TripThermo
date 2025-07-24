// app/screens/signup.tsx
import { auth, db } from "@/firebaseConfig";
import { ref, set } from "@firebase/database";
import { router } from "expo-router";
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
import styles from "../../assets/css/signup";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [district, setDistrict] = useState("");

  const handleSignup = async () => {
    if (!email || !password || !username || !district) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send verification email
      if (user) {
        await sendEmailVerification(user);
      }

      // Save user to Realtime Database
      await set(ref(db, "users/" + user.uid), {
        uid: user.uid,
        email: user.email,
        username,
        district,
        role: "user", // default role
        createdAt: new Date().toISOString(),
      });

      Alert.alert(
        "Verify Your Email",
        "A verification link has been sent to your email. Please verify before logging in."
      );

      router.replace("/auth/login");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.label}>Username:</Text>
          <TextInput
            placeholder="Username"
            style={styles.input}
            onChangeText={setUsername}
          />
          <Text style={styles.label}>District:</Text>
          <TextInput
            placeholder="District"
            style={styles.input}
            onChangeText={setDistrict}
          />
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

          <View style={styles.signupButton}>
            <Button title="Sign Up" onPress={handleSignup} color="#4F46E5" />
          </View>

          <Text style={styles.loginPrompt}>
            Already have an account?{" "}
            <Text
              style={{ color: "#4F46E5" }}
              onPress={() => router.replace("/auth/login")}
            >
              Log In
            </Text>
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
