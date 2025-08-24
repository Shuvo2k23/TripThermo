import { useTheme } from '@/app/contexts/ThemeContext';
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!data) return;

    const filtered: PlaceData = {};
    Object.entries(data).forEach(([key, val]) => {
      // Search both place name and district
      const searchLower = searchText.toLowerCase();
      const placeMatch = val.place.toLowerCase().includes(searchLower);
      const districtMatch = val.district.toLowerCase().includes(searchLower);
      
      if (placeMatch || districtMatch) {
        filtered[key] = val;
      }
    });
    setFilteredPlaces(filtered);
  }, [searchText, data]);

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

  // Dynamic styles with theme
  const dynamicStyles = StyleSheet.create({
    wrapper: {
      marginBottom: 12,
      zIndex: 1000,
    },
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    icon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
    },
    dropdownContainer: {
      marginTop: 8,
    },
    dropdown: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,

    },
    resultRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + '30',
    },
    lastResultRow: {
      borderBottomWidth: 0,
    },
    itemContainer: {
      flex: 1,
      paddingRight: 12,
    },
    placeText: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '500',
    },
    districtText: {
      fontSize: 12,
      color: theme.colors.text + '99',
      marginTop: 2,
    },
    editButton: {
      color: theme.colors.primary,
      fontWeight: "600",
      fontSize: 14,
      padding: 8,
      backgroundColor: theme.colors.primary + '20',
      borderRadius: 8,
      minWidth: 60,
      textAlign: 'center',
    },
    noResults: {
      padding: 16,
      textAlign: 'center',
      color: theme.colors.text + '99',
      fontStyle: 'italic',
    },
  });

  const renderResultItem = ({ item: [key, val], index }: { item: [string, any], index: number }) => {
    const entries = Object.entries(filteredPlaces);
    
    return (
      <View 
        style={[
          dynamicStyles.resultRow,
          index === entries.length - 1 && dynamicStyles.lastResultRow
        ]}
      >
        <TouchableOpacity
          style={dynamicStyles.itemContainer}
          onPress={() => {
            setSearchText("");
            router.push({
              pathname: "/components/place/[id]",
              params: { id: key, details: JSON.stringify(val) },
            });
          }}
        >
          <Text style={dynamicStyles.placeText}>🔍 {val.place}</Text>
          <Text style={dynamicStyles.districtText}>📍 {val.district}</Text>
        </TouchableOpacity>

        {role === "admin" && (
          <TouchableOpacity
            onPress={() => {
              setSearchText("");
              router.push({
                pathname: "/components/edit/[id]",
                params: { id: key, details: JSON.stringify(val) },
              });
            }}
          >
            <Text style={dynamicStyles.editButton}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={dynamicStyles.wrapper}
    >
      <View style={dynamicStyles.searchRow}>
        <FontAwesome
          name="search"
          size={20}
          color={theme.colors.text + '99'}
          style={dynamicStyles.icon}
        />
        <TextInput
          style={dynamicStyles.searchInput}
          placeholder="Search places or districts..."
          placeholderTextColor={theme.colors.text + '99'}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {searchText.length > 0 && (
        <View style={dynamicStyles.dropdownContainer}>
          <View style={dynamicStyles.dropdown}>
            {Object.keys(filteredPlaces).length > 0 ? (
              <FlatList
                data={Object.entries(filteredPlaces)}
                renderItem={renderResultItem}
                keyExtractor={([key]) => key}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              />
            ) : (
              <Text style={dynamicStyles.noResults}>
                No places found for "{searchText}"
              </Text>
            )}
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default SearchBox;