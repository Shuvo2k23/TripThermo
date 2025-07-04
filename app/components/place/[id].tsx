// app/user/details.tsx
import RelatedPlaces from "@/app/components/RelatedPlaces";
import styles from "@/assets/css/details";
import { usePlaceDetails } from "@/utils/usePlaceDetails";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import WeatherCard from "../WeatherCard";

export default function PlaceDetails() {
  const { details } = useLocalSearchParams();
  const { item, relatedPlaces } = usePlaceDetails(details);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
      source={{
        uri: typeof item?.image === "string"
          ? item.image
          : "https://i.ytimg.com/vi/II5G7qnZ3CU/maxresdefault.jpg"
      }}
      style={styles.image}
      />

      {item ? ( 
      <View style={styles.card}>
        <Text style={styles.placeName}>{item.place}</Text>
        <Text style={styles.district}>📍 District: {item.district}</Text>
        <Text style={styles.description}>
        Explore the beauty and history of{" "}
        <Text style={styles.bold}>{item.place}</Text>, a wonderful tourist
        destination in <Text style={styles.bold}>{item.district}</Text>.
        Known for its unique attractions, local culture, and warm
        hospitality, this place is a must-visit for anyone looking for
        authentic experiences and memorable moments.
        </Text>
      </View>
      ) : (
      <Text>Loading...</Text>
      )}
      {
        item ? <WeatherCard district={item.district} /> : null
      }
      <RelatedPlaces data={relatedPlaces} />
    </ScrollView>
  );
}
