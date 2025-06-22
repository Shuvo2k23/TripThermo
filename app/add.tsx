import React, { useState } from "react";
import {
  Button,
  ScrollView,
  TextInput,
  View
} from "react-native";

import { onValue, ref } from "firebase/database";

import { db } from "@/firebaseConfig";
import { set } from "firebase/database";
import PlaceCardList from "./components/PlaceLists";
import styles from "./css/add";

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

        <PlaceCardList data={data}/>
      </ScrollView>
    </View>
  );
}

