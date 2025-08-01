import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../../assets/css/searchBox";
type PlaceData = {
  [key: string]: {
    place: string;
    district: string;
    description?: string;
    image?: string;
  };
};

interface SearchBoxProps {
  data: PlaceData;
}

const SearchBox = ({ data }: SearchBoxProps) => {
  const [searchText, setSearchText] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState<PlaceData>({});
  const [role, setRole] = useState<string | null>(null);

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
  }, [searchText]);
  useEffect(() => {
    const fetchRole = async () => {
      const userJson = await AsyncStorage.getItem("user");
      if (userJson) {
        const user = JSON.parse(userJson);
        setRole(user.role || null);
      }
    };
    fetchRole();
  }, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.wrapper}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.searchRow}>
          <FontAwesome
            name="search"
            size={20}
            color="#999"
            style={styles.icon}
          />
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
              <View key={key} style={styles.resultRow}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    router.push({
                      pathname: "/components/place/[id]",
                      params: { id: key, details: JSON.stringify(val) },
                    })
                  }
                >
                  <Text style={styles.item}>🔎 {val.place}</Text>
                </TouchableOpacity>

                {role === "admin" && (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/components/edit/[id]",
                        params: { id: key, details: JSON.stringify(val) },
                      })
                    }
                  >
                    <Text style={styles.editButton}>✏️ Edit</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SearchBox;
