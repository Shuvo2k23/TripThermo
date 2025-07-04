// app/user/profile.tsx
import styles from "@/assets/css/profilePage";
import { auth, db } from "@/firebaseConfig";
import { signOut } from "@firebase/auth";
import { onValue, ref } from "@firebase/database";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  Text,
  View
} from "react-native";
export default function UserProfile() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    try {
      await signOut(auth);
      router.replace("/auth/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const goToEdit = () => {
    router.push("/components/EditProfile");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{userData?.username}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{userData?.email}</Text>

        <Text style={styles.label}>District</Text>
        <Text style={styles.value}>{userData?.district}</Text>
      </View>

      <View style={styles.button}>
        <Button title="Edit Profile" onPress={goToEdit} color="#1D4ED8" />
      </View>
      <View style={styles.button}>
        <Button title="Logout" onPress={handleLogout} color="#DC2626" />
      </View>
    </ScrollView>
  );
}

