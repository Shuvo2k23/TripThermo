import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import styles from "../css/details";
export default function PlaceDetails() {
  const { place, district } = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image Section */}
      <Image
        source={{ uri: "https://picsum.photos/600/350" }}
        style={styles.image}
      />

      {/* Card Section */}
      <View style={styles.card}>
        <Text style={styles.placeName}>{place}</Text>
        <Text style={styles.district}>📍 District: {district}</Text>
        <Text style={styles.description}>
          Explore the beauty and history of <Text style={styles.bold}>{place}</Text>, a wonderful
          tourist destination in <Text style={styles.bold}>{district}</Text>. Known for its unique
          attractions, local culture, and warm hospitality, this place is a must-visit for anyone
          looking for authentic experiences and memorable moments.
        </Text>
      </View>
    </ScrollView>
  );
}
