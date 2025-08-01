// app/user/details.tsx
import RelatedPlaces from "@/app/components/RelatedPlaces";
import styles from "@/assets/css/details";
import { usePlaceDetails } from "@/utils/usePlaceDetails";
import { Image, RefreshControl, ScrollView, Text, View } from "react-native";
import AIDescription from "./AIDescription";
import WeatherCard from "./WeatherCard";


export default function PlaceDetails({ details }: { details: any }) {

  const { item, relatedPlaces } = usePlaceDetails(details);
    console.log(details);
    
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
      <RefreshControl
        refreshing={false}
        onRefresh={() => {
        // Add your refresh logic here, e.g. re-fetch place details
        }}
      />
      }
    >
      <Image
      source={{
        uri:
        item && typeof item.image === "string" && item.image !== ""
          ? item.image
          : "https://i.ytimg.com/vi/II5G7qnZ3CU/maxresdefault.jpg"
      }}
      style={styles.image}
      />

      {item ? (
        <View style={styles.card}>
          <Text style={styles.placeName}>{item.place}</Text>
          <Text style={styles.district}>📍 District: {item.district}</Text>
          {item.description ? <Text style={styles.description}>{item.description}</Text> 
          : <Text>Description will be added soon.😊</Text>}
        </View>
      ) : (
        <Text>Loading...</Text>
      )}

      {/* Display current weather if available */}
      {item ? <WeatherCard district={item.district.trim()} /> : null}

      {/* Display AI-generated description */}
      <View style={styles.card}>
        <AIDescription data={item} />
      </View>

      <RelatedPlaces
        data={
          relatedPlaces
            ? Object.fromEntries(
                Object.entries(relatedPlaces).map(([key, place]) => [
                  key,
                  {
                    ...place,
                    image:
                      place && typeof place.image === "string"
                        ? place.image
                        : undefined,
                  },
                ])
              )
            : undefined
        }
      />
    </ScrollView>
  );
}