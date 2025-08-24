// app/screens/signup.tsx
import { auth, db } from "@/firebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useState } from "react";
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
  View
} from "react-native";
import { useTheme } from '../contexts/ThemeContext';

export default function Signup() {
  const [username, setUsername] = useState("");
  const [district, setDistrict] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { theme, } = useTheme();

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

  // Dynamic styles with theme
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 24,
      backgroundColor: theme.colors.background,
      paddingBottom: 200,
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logoContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      borderWidth: 2,
      borderColor: theme.colors.primary + '30',
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
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 8,
      fontWeight: '600',
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



    signupButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 20,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    signupButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    loginPrompt: {
      textAlign: "center",
      color: theme.colors.text,
      opacity: 0.7,
      fontSize: 14,
      marginBottom: 8,
    },
    loginLink: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    themeToggle: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 50 : 20,
      right: 20,
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    inputWithIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 16,
    },
    inputIcon: {
      marginRight: 12,
    },
    inputField: {
      flex: 1,
      paddingVertical: 16,
      fontSize: 16,
      color: theme.colors.text,
    },
    passwordInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 16,
    },
    passwordInput: {
      flex: 1,
      paddingVertical: 16,
      fontSize: 16,
      color: theme.colors.text,
    },
    eyeIcon: {
      padding: 8,
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
          

          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Ionicons name="person-add" size={40} color={theme.colors.primary} />
            </View>
            
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join us and start your journey with our community
            </Text>
            
            <View style={styles.decorationLine} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons 
                name="person-outline" 
                size={20} 
                color={theme.colors.text + '80'} 
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Choose a username"
                placeholderTextColor={theme.colors.text + '80'}
                style={styles.inputField}
                onChangeText={setUsername}
                value={username}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* District Field - FIXED */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>District</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons 
                name="location-outline" 
                size={20} 
                color={theme.colors.text + '80'} 
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Enter your district"
                placeholderTextColor={theme.colors.text + '80'}
                style={styles.inputField}
                onChangeText={setDistrict}
                value={district}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email Field - FIXED */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={theme.colors.text + '80'} 
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.text + '80'}
                style={styles.inputField}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmail}
                value={email}
              />
            </View>
          </View>

          {/* Password Field - FIXED */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color={theme.colors.text + '80'} 
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Create a password"
                placeholderTextColor={theme.colors.text + '80'}
                style={styles.passwordInput}
                secureTextEntry={!isPasswordVisible}
                onChangeText={setPassword}
                value={password}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons 
                  name={isPasswordVisible ? "eye-off" : "eye"} 
                  size={20} 
                  color={theme.colors.text + '80'} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={styles.signupButton}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Login Prompt */}
          <Text style={styles.loginPrompt}>
            Already have an account?{" "}
            <Text
              style={styles.loginLink}
              onPress={() => router.replace("/auth/login")}
            >
              Log In
            </Text>
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}