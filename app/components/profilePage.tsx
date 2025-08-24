// app/user/profile.tsx
import { useTheme } from '@/app/contexts/ThemeContext';
import { auth, db } from "@/firebaseConfig";
import { onValue, ref } from "@firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function UserProfile() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const userRef = ref(db, "users/" + uid);
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    await AsyncStorage.removeItem("user");
    router.replace("/auth/login");
  };

  const goToEdit = () => {
    router.push("/components/EditProfile");
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
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 32,
      marginTop: 16,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border + '30',
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text + 'CC',
      marginBottom: 6,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    value: {
      fontSize: 18,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: 20,
      padding: 12,
      backgroundColor: theme.colors.background + '50',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border + '20',
    },
    editButton: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 16,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    logoutButton: {
      backgroundColor: theme.colors.notification || '#dc2626',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: theme.colors.notification || '#dc2626',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    userIcon: {
      alignSelf: 'center',
      marginBottom: 16,
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: theme.colors.primary + '40',
    },
    userIconText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    roleBadge: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'center',
      marginBottom: 20,
    },
    roleText: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
  });

  if (loading) {
    return (
      <View style={dynamicStyles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData?.username) return '👤';
    return userData.username.charAt(0).toUpperCase();
  };

  return (
    <ScrollView contentContainerStyle={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Your Profile</Text>

      {/* User Avatar */}
      <View style={dynamicStyles.userIcon}>
        <Text style={dynamicStyles.userIconText}>{getUserInitials()}</Text>
      </View>

      {/* Role Badge */}
      {userData?.role && (
        <View style={dynamicStyles.roleBadge}>
          <Text style={dynamicStyles.roleText}>{userData.role}</Text>
        </View>
      )}

      <View style={dynamicStyles.card}>
        <Text style={dynamicStyles.label}>Username</Text>
        <Text style={dynamicStyles.value}>{userData?.username || 'Not set'}</Text>

        <Text style={dynamicStyles.label}>Email</Text>
        <Text style={dynamicStyles.value}>{userData?.email || 'Not set'}</Text>

        <Text style={dynamicStyles.label}>District</Text>
        <Text style={dynamicStyles.value}>{userData?.district || 'Not set'}</Text>
      </View>

      <TouchableOpacity 
        style={dynamicStyles.editButton} 
        onPress={goToEdit}
        activeOpacity={0.8}
      >
        <Text style={dynamicStyles.buttonText}> Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={dynamicStyles.logoutButton} 
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={dynamicStyles.buttonText}> Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}