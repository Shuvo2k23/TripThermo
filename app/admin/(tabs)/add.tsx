import React, { useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";

import { onValue, ref, set } from "firebase/database";

import PlaceCardList from "@/app/components/PlaceCardLists";
import styles from "@/assets/css/add";
import { db } from "@/firebaseConfig";

export default function Add() {
  const [place, setPlace] = useState("");
  const [district, setDistrict] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [data, setData] = useState<PlaceData>();
  const [loading, setLoading] = useState(false); 
  type PlaceData = {
    [key: string]: {
      place: string;
      district: string;
    };
  };

  const getDatabase = async () => {
    try {
      const starCountRef = ref(db, "places/");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setData(data);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const dataAdd = async () => {
    if (place.trim() !== "" && district.trim() !== "") {
      setLoading(true); 

      await set(ref(db, "places/" + place), {
        place,
        district,
        description,
        image,
      });

      setPlace("");
      setDistrict("");
      setDescription("");
      setImage("");
      setLoading(false); 
    }
  };

  return (
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
            style={styles.input}
            placeholder="Description..."
            value={description}
            onChangeText={setDescription}
          />
          <Text style={styles.label}>Add Image</Text>
          <TextInput
            style={styles.input}
            placeholder="Image URL..."
            value={image}
            onChangeText={setImage}
          />
          <View style={styles.buttonContainer}>
            <Button title="See All" onPress={getDatabase} color="#2196F3" />
            <Button
              title={loading ? "Processing..." : "Add Place"}
              onPress={dataAdd}
              color="#4CAF50"
              disabled={loading}
            />
          </View>
        </View>

        <PlaceCardList data={data} />
      </ScrollView>
    </View>
  );
}
