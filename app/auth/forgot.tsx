// app/auth/forgot.tsx
import { auth, db } from "@/firebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import { get, ref } from "@firebase/database";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
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
  View
} from "react-native";
import { useTheme } from '../contexts/ThemeContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

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
      Alert.alert(
        "Success", 
        "Password reset email sent! Please check your inbox.",
        [{ text: "OK", onPress: () => router.replace("/auth/login") }]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      padding: 24,
      backgroundColor: theme.colors.background,
      flexGrow: 1,
      justifyContent: "center",
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      borderWidth: 2,
      borderColor: theme.colors.primary + '30',
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 12,
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
    inputContainer: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 8,
      fontWeight: '600',
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
    resetButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginBottom: 20,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    resetButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    link: {
      color: theme.colors.primary,
      textAlign: "center",
      fontSize: 16,
      marginTop: 16,
      fontWeight: '500',
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    decorationLine: {
      width: 50,
      height: 3,
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
      marginTop: 16,
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
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="key" size={32} color={theme.colors.primary} />
            </View>
            
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you instructions to reset your password
            </Text>
            
            <View style={styles.decorationLine} />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
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
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
          </View>

          {/* Reset Button */}
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleReset}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.resetButtonText}>Send Reset Email</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login Link */}
          <Text
            style={styles.link}
            onPress={() => !loading && router.replace("/auth/login")}
          >
            ← Back to Login
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