// app/auth/forgot.tsx
import { auth, db } from "@/firebaseConfig";
import { sendPasswordResetEmail } from "@firebase/auth";
import { get, ref } from "@firebase/database";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Button,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    try {
      // Check if email exists in Realtime Database
      const snapshot = await get(ref(db, "users"));
      let emailExists = false;

      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.email === email) {
          emailExists = true;
        }
      });

      if (!emailExists) {
        Alert.alert("Error", "Email not found in our records.");
        return;
      }

      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset email sent!");
      router.replace("/auth/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Reset Password</Text>

          <TextInput
            placeholder="Enter your email"
            style={styles.input}
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
          />

          <View style={styles.button}>
            <Button title="Send Reset Email" onPress={handleReset} color="#4F46E5" />
          </View>

          <Text
            style={styles.link}
            onPress={() => router.replace("/auth/login")}
          >
            Go back to Login
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F0F4F8",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    marginBottom: 15,
  },
  link: {
    color: "#4F46E5",
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
  },
});
