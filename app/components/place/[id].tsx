// app/user/details.tsx
import styles from "@/assets/css/details";
import { usePlaceDetails } from "@/utils/usePlaceDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, View } from "react-native";

import PlaceCard from "../PlaceCard";

export default function PlaceDetails() {
  const { details } = useLocalSearchParams();
  const { item, relatedPlaces } = usePlaceDetails(details);
  const [isWeatherCached, setIsWeatherCached] = useState(false);

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
  // Check for cached weather data
  useEffect(() => {
    checkCache();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              checkCache();
            }}
          />
        }
      >
        <Image
          source={{
            uri:
              item && typeof item.image === "string" && item.image !== ""
                ? item.image
                : defaultImage,
          }}
          style={styles.image}
        />

        {item ? (
          <View style={styles.card}>
            <Text style={styles.placeName}>{item.place}</Text>
            <Text style={styles.district}>📍 District: {item.district}</Text>
            {item.description ? (
              <Text style={styles.description}>{item.description}</Text>
            ) : (
              <Text>Description will be added soon.😊</Text>
            )}
          </View>
        ) : (
          <Text>Loading...</Text>
        )}

        {/* Show weather */}
        {/* {item ? <WeatherCard district={item.district.trim()} /> : null} */}

        {/* Conditionally show AI Description */}
        {/* <View style={styles.card}>
          {isWeatherCached ? (
            <AIDescription data={item} />
          ) : (
            <Text>Weather info not available. Please refresh.</Text>
          )}
        </View> */}

        {relatedPlaces ? (
          <View>
            <Text style={styles.title}>Related Places</Text>
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
          <Text style={styles.title}>No related places found.</Text>
        )}
      </ScrollView>
    </View>
  );
}
