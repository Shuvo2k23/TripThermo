// app/user/details.tsx
import { useTheme } from "@/app/contexts/ThemeContext";
import styles from "@/assets/css/details";
import { usePlaceDetails } from "@/utils/usePlaceDetails";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PlaceCard from "../PlaceCard";

export default function PlaceDetails() {
  const { details } = useLocalSearchParams();
  const { item, relatedPlaces } = usePlaceDetails(details);
  const [isWeatherCached, setIsWeatherCached] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { theme } = useTheme();
  const auth = getAuth();
  const db = getDatabase();

  const defaultImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQce_yi8YIsdo2ZFjEcCahx5IGiFNkprxP4og&s";

  const checkCache = async () => {
    if (item?.district) {
      const key = `weather_${item.district.trim()}`;
      try {
        const cachedData = await AsyncStorage.getItem(key);
        setIsWeatherCached(!!cachedData);
      } catch (e) {
        console.error("AsyncStorage error", e);
        setIsWeatherCached(false);
      }
    }
  };

  // Check if place is bookmarked
  const checkBookmarkStatus = () => {
    if (!auth.currentUser || !item) return;

    const bookmarkRef = ref(
      db,
      `bookmarks/${auth.currentUser.uid}/${item.place}`
    );
    onValue(bookmarkRef, (snapshot) => {
      setIsBookmarked(snapshot.exists());
    });
  };

  // Toggle bookmark status
  const toggleBookmark = () => {
    if (!auth.currentUser || !item) return;

    const bookmarkRef = ref(
      db,
      `bookmarks/${auth.currentUser.uid}/${item.place}`
    );

    if (isBookmarked) {
      // Remove bookmark
      remove(bookmarkRef)
        .then(() => {
          console.log("Bookmark removed successfully");
          setIsBookmarked(false);
        })
        .catch((error) => {
          console.error("Error removing bookmark:", error);
        });
    } else {
      // Add bookmark
      set(bookmarkRef, {
        place: item.place,
        district: item.district,
        description: item.description,
        image: item.image || defaultImage,
        timestamp: Date.now(),
      })
        .then(() => {
          console.log("Bookmark added successfully");
          setIsBookmarked(true);
        })
        .catch((error) => {
          console.error("Error adding bookmark:", error);
        });
    }
  };

  useEffect(() => {
    checkCache();
    checkBookmarkStatus();
  }, [item]);

  // Create dynamic styles with theme
  const dynamicStyles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.colors.background,
      flexGrow: 1,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 24,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      marginTop: 20,
      borderWidth: 1,
      borderColor: theme.colors.border + "30",
    },
    placeName: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 8,
      textAlign: "center",
    },
    district: {
      fontSize: 18,
      fontWeight: "500",
      color: theme.colors.text + "CC",
      marginBottom: 16,
      textAlign: "center",
    },
    description: {
      fontSize: 16,
      lineHeight: 26,
      color: theme.colors.text,
      textAlign: "justify",
      marginTop: 8,
    },
    title: {
      fontSize: 22,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 14,
      paddingLeft: 4,
      marginTop: 32,
    },
    weatherButton: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 20,
      marginBottom: 20,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    weatherButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    weatherButtonDisabled: {
      backgroundColor: theme.colors.border,
      opacity: 0.7,
    },
    noDataText: {
      color: theme.colors.text + "99",
      textAlign: "center",
      fontStyle: "italic",
    },
    imageContainer: {
      position: "relative",
    },
    bookmarkIcon: {
      position: "absolute",
      top: 16,
      right: 16,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: 20,
      padding: 8,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              checkCache();
              checkBookmarkStatus();
            }}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={dynamicStyles.imageContainer}>
          <Image
            source={{
              uri:
                item && typeof item.image === "string" && item.image !== ""
                  ? item.image
                  : defaultImage,
            }}
            style={styles.image}
          />
          {auth.currentUser && (
            <TouchableOpacity
              style={dynamicStyles.bookmarkIcon}
              onPress={toggleBookmark}
            >
              <MaterialIcons
                name={isBookmarked ? "bookmark" : "bookmark-border"}
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          )}
        </View>

        {item ? (
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.placeName}>{item.place}</Text>
            <Text style={dynamicStyles.district}>
              📍 District: {item.district}
            </Text>
            {item.description ? (
              <Text style={dynamicStyles.description}>{item.description}</Text>
            ) : (
              <Text style={dynamicStyles.noDataText}>
                Description will be added soon.😊
              </Text>
            )}
          </View>
        ) : (
          <Text style={dynamicStyles.noDataText}>Loading...</Text>
        )}

        <TouchableOpacity
          style={[
            dynamicStyles.weatherButton,
            !item?.district && dynamicStyles.weatherButtonDisabled,
          ]}
          onPress={() => {
            if (item) {
              router.push({
                pathname: "/components/place/weather/[place]",
                params: { place: item.place, district: item.district },
              });
            }
          }}
          disabled={!item}
          activeOpacity={0.8}
        >
          <Text style={dynamicStyles.weatherButtonText}>
            View Weather Details
          </Text>
        </TouchableOpacity>

        {relatedPlaces ? (
          <View>
            <Text style={dynamicStyles.title}>Related Places</Text>
            {Object.entries(relatedPlaces).map(([key, place]) => (
              <PlaceCard
                key={key}
                id={key}
                place={place.place}
                district={place.district}
                description={place.description}
                image={
                  typeof place.image === "string" ? place.image : defaultImage
                }
                data={place}
              />
            ))}
          </View>
        ) : (
          <Text style={dynamicStyles.title}>No related places found.</Text>
        )}
      </ScrollView>
    </View>
  );
}
