import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { router } from "expo-router";
import { default as React, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";


export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created!");
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput placeholder="Email" style={styles.input} onChangeText={(event)=>setEmail(event)} />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={(event)=>setPassword(event)}
      />
      <Button title="Sign Up" onPress={handleSignup} />
      <View style={styles.buttonWrapper}>
        <Button
          title="Have account? go to login page"
          onPress={() => router.replace("/login")}
          color="#2196F3"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
