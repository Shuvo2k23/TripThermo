import { auth, db } from "@/firebaseConfig";
import { getAuth, signOut } from "@firebase/auth";
import { router } from "expo-router";
import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import styles from "./css/styles";

export default function Index() {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState<PlaceData>();
  const [usermail, setUsermail] = useState<String|null>();
  type PlaceData = {
    [key: string]: {
      place: string;
      district: string;
    };
  };
  const places = [];
  useEffect(() => {
    getDatabase();
    const user = auth.currentUser;
    if (user) {
      console.log("User email: ", user.email);
      setUsermail(user.email);
    }
  }, []);
  const handleSearch = () => {
    console.log("Searching for:", searchText);
  };
  type data = {
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
      // for testing purpose
      // Object.entries(data).map(([key, val]) =>{
      //   console.log(val["district"], " ", val["place"])
      //   places.push(key);
      // }
      // );
      // console.log(places);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={styles.container}>
      {/* Content Scrollable */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <Button title="Search" onPress={handleSearch} />
        </View>

        {/* Cards Area */}
        <View style={styles.cardContainer}>
          {usermail == "admin@fake.com" ? (
            <Button title="Add" onPress={() => router.push("/add")} />
          ) : (
            ""
          )}
          {data ? (
            Object.entries(data).map(([key, val]) => (
              <View key={key} style={styles.card}>
                <Text style={styles.placeText}>📍 {val.place}</Text>
                <Text style={styles.districtText}>🏙️ {val.district}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.loadingText}>Loading or no data available</Text>
          )}
        </View>
      </ScrollView>
       <Button title="Log Out" onPress={() => {
        signOut(getAuth()).then(() => console.log('User signed out!'));
        router.replace("/login")
       }} />
    </View>
  );
}
