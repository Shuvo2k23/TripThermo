import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../css/searchBox";
type PlaceData = {
  [key: string]: {
    place: string;
    district: string;
  };
};

type Props = {
  data: PlaceData | undefined;
};

const SearchBox: React.FC<Props> = ({ data }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState<PlaceData>({});
  const router = useRouter();

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
                router.push(`/place/${key}?place=${val.place}&district=${val.district}`)
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
