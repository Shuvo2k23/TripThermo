import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { get, getDatabase, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../../assets/css/searchBox";
type PlaceData = {
  [key: string]: {
    place: string;
    district: string;
    description?: string;
    image?: string;
  };
};

type Props = {
  data: PlaceData | undefined;
};

const SearchBox = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState<PlaceData>({});
  const router = useRouter();
  const [data, setData] = useState<PlaceData | undefined>(undefined);

  const getData = async () => {
    try {
      const db = getDatabase();
      const snapshot = await get(ref(db, "/places"));
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        setData({});
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData({});
    }
  };

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    if (!data) return;

    const filtered: PlaceData = {};
    Object.entries(data).forEach(([key, val]) => {
      if (val.place.toLowerCase().startsWith(searchText.toLowerCase())) {
        filtered[key] = val;
      }
    });

    setFilteredPlaces(filtered);
  }, [searchText, data]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.searchRow}>
        <FontAwesome name="search" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="search places..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      {searchText.length > 0 && Object.keys(filteredPlaces).length > 0 && (
        <View style={styles.dropdown}>
          {Object.entries(filteredPlaces).map(([key, val]) => (
            <TouchableOpacity
              key={key}
              onPress={() =>
                router.push( `/components/place/${key}?details=${JSON.stringify(val)}`)
              }
            >
              <Text style={styles.item}>🔎 {val.place}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default SearchBox;
