import React, { useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { onValue, ref } from "firebase/database";

import { db } from "@/firebaseConfig";
import { set } from "firebase/database";

export default function Add() {
  const [place, setPlace] = useState("");
  const [district, setDistrict] = useState("");
  const [data, setData] = useState<PlaceData>();
  type PlaceData = {
    [key: string]: {
      place: string;
      district: string;
    };
  };
  const getDatabase = async () => {
    try {
      const starCountRef = ref(db, "users/");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setData(data);
      });
      // Object.entries(data).map(([key, val]) =>
      //   console.log(val["district"], " " ,key)
      // );
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  const dataAdd = async () => {
    if (place.trim() != "" && district.trim() != "") {
      await set(ref(db, "users/" + place), {
        place: place,
        district: district,
      });
      // setDistrict("");
      setPlace("");
    }
  };
  const handleAdd = () => {
    console.log(place, " : ", district);
  };
  return (
    <View style={styles.page}>
      {/* Display Data */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Place Name..."
            value={place}
            onChangeText={setPlace}
          />
          <TextInput
            style={styles.input}
            placeholder="District Name..."
            value={district}
            onChangeText={setDistrict}
          />
          <View style={styles.buttonContainer}>
            <Button title="See All" onPress={getDatabase} color="#2196F3" />
            <Button title="Add Place" onPress={dataAdd} color="#4CAF50" />
          </View>
        </View>

        {data ? (
          Object.entries(data).map(([key, val]) => (
            <View key={key} style={styles.card}>
              <Text style={styles.placeText}>📍 {val.place}</Text>
              <Text style={styles.districtText}>🏙️ {val.district}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.loadingText}></Text>
        )}
      </ScrollView>
    </View>
  );
}

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  placeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  districtText: {
    fontSize: 14,
    color: "#475569",
    marginTop: 4,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },
});
