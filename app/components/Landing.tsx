import PlaceCard from "@/app/components/PlaceCard";
import SearchBox from "@/app/components/SearchBox";
import styles from "@/assets/css/styles";
import { auth, db } from "@/firebaseConfig";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

export default function Landing() {
  const [data, setData] = useState<PlaceData>();
  const [dataArray, setDataArray] = useState<[string, any][]>([]);
  const [userDistrict, setUserDistrict] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  type PlaceData = {
    [key: string]: {
      place: string;
      district: string;
      description?: string;
      image?: string;
    };
  };
  const getPlaces = async () => {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.log("No user is logged in");
      return;
    }

    const userRef = ref(db, "users/" + uid);
    const userSnapshot = await get(userRef);
    if (!userSnapshot.exists()) {
      console.log("User not found in database");
      return;
    }

    const userData = userSnapshot.val();
    const userDistrict = userData.district;
    const isAdmin = userData.role === "admin";

    setUserDistrict(userDistrict); // just for display if needed

    const placesRef = ref(db, "places/");
    const snapshot = await get(placesRef); // use get() instead of onValue

    const data = snapshot.val();
    if (!data) {
      setData(undefined);
      return;
    }

    setData(data);

    if (isAdmin) {
      setDataArray(Object.entries(data));
    } else {
      const filteredEntries = Object.entries(data).filter(
        ([, place]: [string, any]) =>
          place.district.trim().toLowerCase() ===
          userDistrict.trim().toLowerCase()
      );

      const filtered: PlaceData = {};
      filteredEntries.forEach(([key, value]) => {
        filtered[key] = value as PlaceData[string];
      });

      setDataArray(Object.entries(filtered));
    }
  } catch (err) {
    console.log("Error loading data:", err);
  }
};


  const onRefresh = async () => {
    setRefreshing(true);
    await getPlaces();
    setRefreshing(false);
  };
  
  useEffect( () => {
    onRefresh();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={dataArray}
        keyExtractor={([key]) => key}
        numColumns={2}
        contentContainerStyle={styles.content}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false} 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <View>
            {
              data && (<SearchBox data={data ?? {}} />)
            }
            <Text style={{ fontSize: 18, fontWeight: "bold", padding: 10 }}>
              Place List:
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          const [key, val] = item;
          return (
            <PlaceCard
              id={key}
              place={val.place}
              district={val.district}
              description={val.description}
              image={val.image}
              data={val}
            />
          );
        }}
      />
    </View>
  );
}
