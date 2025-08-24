// app/screens/login.tsx
import { auth, db } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { get, ref } from "firebase/database";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();

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
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before logging in."
        );
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
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            role: role,
            ...userData, // any other data from DB
          })
        );

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

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 24,
      backgroundColor: theme.colors.background,
      paddingBottom: 200,
    },
    headerContainer: {
      alignItems: "center",
      marginBottom: 40,
      marginTop: 50,
    },
    logoContainer: {
      width: 290,
      height: 220,
      borderRadius: 5,
      backgroundColor: theme.colors.primary + "20", // 20% opacity of primary color
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
      borderWidth: 2,
      borderColor: theme.colors.primary + "40", // 40% opacity
    },
    logoImage: {
      width: 315,
      height: 215,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.text,
      opacity: 0.7,
      textAlign: "center",
      marginBottom: 8,
      lineHeight: 24,
    },
    decorationLine: {
      width: 60,
      height: 4,
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
      marginTop: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 40,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 8,
      fontWeight: "500",
    },
    input: {
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      fontSize: 16,
      color: theme.colors.text,
    },
    passwordInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    passwordInput: {
      flex: 1,
      padding: 16,
      fontSize: 16,
      color: theme.colors.text,
    },
    eyeIcon: {
      padding: 16,
    },
    loginButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginTop: 10,
      marginBottom: 20,
    },
    loginButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    signupPrompt: {
      textAlign: "center",
      color: theme.colors.text,
      opacity: 0.7,
      fontSize: 14,
      marginBottom: 8,
    },
    signupLink: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    forgotPassword: {
      color: theme.colors.notification,
      textAlign: "center",
      marginTop: 16,
      fontWeight: "500",
    },
    themeToggle: {
      position: "absolute",
      top: Platform.OS === "ios" ? 50 : 20,
      right: 20,
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 8,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Theme Toggle Button */}
          <TouchableOpacity
            style={styles.themeToggle}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isDark ? "sunny" : "moon"}
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              {/* Replace with your actual image */}
              <Image
                source={require("@/assets/images/plane.gif")} // or use a URL
                style={styles.logoImage}
                contentFit="contain"
                transition={300}
              />

              {/* Alternative: Use an icon if you don't have an image */}
              {/* <Ionicons name="lock-closed" size={40} color={theme.colors.primary} /> */}
            </View>

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your journey and access your account
            </Text>

            <View style={styles.decorationLine} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.text + "80"}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.text + "80"}
                style={styles.passwordInput}
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={20}
                  color={theme.colors.text + "80"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.signupPrompt}>
            Don't have an account?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => router.replace("/auth/signup")}
            >
              Sign Up
            </Text>
          </Text>

          <Text
            style={styles.forgotPassword}
            onPress={() => router.push("/auth/forgot")}
          >
            Forgot Password?
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
