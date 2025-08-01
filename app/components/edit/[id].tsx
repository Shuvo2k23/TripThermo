import { useLocalSearchParams, useRouter } from "expo-router";
import { ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import styles from "@/assets/css/add";
import { db } from "@/firebaseConfig";

export default function EditPlace() {
  const { id, details } = useLocalSearchParams<{ id: string; details: string }>();
  const router = useRouter();

  const [place, setPlace] = useState("");
  const [district, setDistrict] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (details) {
      try {
        const parsed = JSON.parse(details);
        setPlace(parsed.place || "");
        setDistrict(parsed.district || "");
        setDescription(parsed.description || "");
        setImage(parsed.image || "");
      } catch (e) {
        Alert.alert("Error", "Invalid place details.");
      }
    }
  }, [details]);

  const updatePlace = async () => {
    if (place.trim() !== "" && district.trim() !== "") {
      setLoading(true);
      try {
        await set(ref(db, "places/" + id), {
          place,
          district,
          description,
          image,
        });
        Alert.alert("Success", "Place updated successfully!");
        router.back();
      } catch (error) {
        Alert.alert("Error", "Failed to update place. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.page}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Place Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Place Name..."
                value={place}
                onChangeText={setPlace}
              />
              <Text style={styles.label}>District Name</Text>
              <TextInput
                style={styles.input}
                placeholder="District Name..."
                value={district}
                onChangeText={setDistrict}
              />
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[
                  styles.input,
                  { minHeight: 100, textAlignVertical: "top" },
                ]}
                placeholder="Description..."
                value={description}
                onChangeText={setDescription}
                multiline={true}
              />
              <Text style={styles.label}>Add Image</Text>
              <TextInput
                style={styles.input}
                placeholder="Image URL..."
                value={image}
                onChangeText={setImage}
              />
              <Button
                title={loading ? "Updating..." : "Update Place"}
                onPress={updatePlace}
                color="#2196F3"
                disabled={loading}
              />
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
