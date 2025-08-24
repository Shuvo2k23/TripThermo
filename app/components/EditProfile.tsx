// app/user/edit.tsx
import { useTheme } from "@/app/contexts/ThemeContext";
import { auth, db } from "@/firebaseConfig";
import { get, ref, update } from "@firebase/database";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const userRef = ref(db, "users/" + uid);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUsername(data.username);
        setDistrict(data.district);
      }
      setLoading(false);
    });
  }, []);

  const handleUpdate = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    if (!username || !district) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      await update(ref(db, "users/" + uid), {
        username,
        district,
      });
      Alert.alert("Success", "Profile updated successfully!");
      router.back(); // go back to profile
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  // Dynamic styles with theme
  const dynamicStyles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: theme.colors.background,
      padding: 24,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 32,
      marginTop: 16,
    },
    formContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border + "30",
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 8,
      marginTop: 16,
    },
    input: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 8,
    },
    inputFocused: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    characterCount: {
      fontSize: 12,
      color: theme.colors.text + "99",
      textAlign: "right",
      marginBottom: 16,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 24,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    cancelButton: {
      backgroundColor: theme.colors.border,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 12,
    },
    cancelButtonText: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "600",
    },
    buttonContainer: {
      marginTop: 8,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },
    backButton: {
      padding: 8,
      marginRight: 16,
    },
  });

  if (loading) {
    return (
      <View style={dynamicStyles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={dynamicStyles.container}>
        <Text style={dynamicStyles.title}>Edit Profile</Text>
        <View style={dynamicStyles.formContainer}>
          <Text style={dynamicStyles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            placeholderTextColor={theme.colors.text + "99"}
            style={dynamicStyles.input}
            maxLength={30}
          />
          <Text style={dynamicStyles.characterCount}>
            {username.length}/30 characters
          </Text>

          <Text style={dynamicStyles.label}>District</Text>
          <TextInput
            value={district}
            onChangeText={setDistrict}
            placeholder="Enter your district"
            placeholderTextColor={theme.colors.text + "99"}
            style={dynamicStyles.input}
            maxLength={50}
          />
          <Text style={dynamicStyles.characterCount}>
            {district.length}/50 characters
          </Text>
        </View>

        <View style={dynamicStyles.buttonContainer}>
          <TouchableOpacity
            onPress={handleUpdate}
            style={dynamicStyles.saveButton}
            activeOpacity={0.8}
          >
            <Text style={dynamicStyles.saveButtonText}> Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            style={dynamicStyles.cancelButton}
            activeOpacity={0.8}
          >
            <Text style={dynamicStyles.cancelButtonText}> Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
