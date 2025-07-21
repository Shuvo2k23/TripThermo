// app/user/edit.tsx
import { auth, db } from "@/firebaseConfig";
import { get, ref, update } from "@firebase/database";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import styles from "../../assets/css/editProfile";

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(true);

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
      Alert.alert("Success", "Profile updated!");
      router.back(); // go back to profile
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
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
      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your name"
        style={styles.input}
      />

      <Text style={styles.label}>District</Text>
      <TextInput
        value={district}
        onChangeText={setDistrict}
        placeholder="Enter your district"
        style={styles.input}
      />

      <View style={styles.button}>
        <TouchableOpacity onPress={handleUpdate} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

