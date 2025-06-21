import { auth } from "@/firebaseConfig";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in!");
    router.replace("/"); // navigate to home or dashboard
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Log In" onPress={handleLogin} />
      <View style={styles.buttonWrapper}>
        <Button
          title="Create Account"
          onPress={() => router.replace("/signup")}
          color="#2196F3"
        />
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  buttonWrapper: {
    padding: 10, // ⬅️ Padding inside the wrapper
    marginTop: 10, // Optional space above
  },
});
