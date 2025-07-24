import styles from "@/assets/css/styles";
import { auth, db } from "@/firebaseConfig";
import { get, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import SearchBox from "../components/SearchBox";
import PlaceCardList from "./PlaceCardLists";

export default function Landing() {
  const [filtered, setFiltered] = useState<PlaceData>();
  const [data, setData] = useState<PlaceData>();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await getPlaces();
    setRefreshing(false);
  };
  type PlaceData = {
    [key: string]: {
      place: string;
      district: string;
    };
  };
  useEffect(() => {
    getPlaces();
  }, []);

  const getPlaces = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.log("No user is logged in");
        return;
      }

      // Step 1: Get user district
      const userRef = ref(db, "users/" + uid);
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        console.log("User not found in database");
        return;
      }

      const userData = userSnapshot.val();
      const userDistrict = userData.district;

      // Step 2: Listen to all places
      const placesRef = ref(db, "places/");
      onValue(placesRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          setData(undefined); // or null, depending on your state
          return;
        }
        setData(data);
        // Step 3: Filter by matching district
        const filteredEntries = Object.entries(data).filter(
          ([, place]: [string, any]) =>
            place.district.trim().toLowerCase() ===
            userDistrict.trim().toLowerCase()
        );
        const filtered: PlaceData = {};
        filteredEntries.forEach(([key, value]) => {
          filtered[key] = value as { place: string; district: string };
        });

        setFiltered(filtered);
      });
    } catch (err) {
      console.log("Error loading data:", err);
    }
  };
  return (
    <View style={styles.container}>
      {/* Content Scrollable */}
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SearchBox data={data ?? {}} />
        <Text style={{ fontSize: 18, fontWeight: "bold", paddingBottom: 12 }}>
          Suggested Places
        </Text>

        <PlaceCardList data={filtered} />
      </ScrollView>
    </View>
  );
}
