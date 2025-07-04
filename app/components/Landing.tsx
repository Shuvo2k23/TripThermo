import styles from "@/assets/css/styles";
import { auth, db } from "@/firebaseConfig";
import { get, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import SearchBox from "../components/SearchBox";
import PlaceCardList from "./PlaceCardLists";
export default function Landing() {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState<PlaceData>();
  const [usermail, setUsermail] = useState<String | null>();

  type PlaceData = {
    [key: string]: {
      place: string;
      district: string;
    };
  };
  const places = [];
  useEffect(() => {
    getPlaces();
    const user = auth.currentUser;
    if (user) {
      console.log("User email: ", user.email);
      setUsermail(user.email);
    }
  }, []);

  useEffect(() => {
    if (!data) return;

    const filtered: PlaceData = {};
    Object.entries(data).forEach(([key, val]) => {
      if (val.place.toLowerCase().startsWith(searchText.toLowerCase())) {
        filtered[key] = val;
      }
    });
  }, [searchText, data]);
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

        // Step 3: Filter by matching district
        const filteredEntries = Object.entries(data).filter(
          ([, place]: [string, any]) =>
            place.district.trim().toLowerCase() === userDistrict.trim().toLowerCase()
        );
        const filtered: PlaceData = {};
        filteredEntries.forEach(([key, value]) => {
          filtered[key] = value as { place: string; district: string };
        });

        setData(filtered);
      });
    } catch (err) {
      console.log("Error loading data:", err);
    }
  };
  return (
    <View style={styles.container}>
      {/* Content Scrollable */}
      <ScrollView contentContainerStyle={styles.content}>
        <SearchBox />
        <Text style={{ fontSize: 18, fontWeight: "bold", paddingBottom: 12 }}>
          Suggested Places
        </Text>

        <PlaceCardList data={data} />
      </ScrollView>
    </View>
  );
}
