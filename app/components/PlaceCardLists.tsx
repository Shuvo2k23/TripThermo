
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../../assets/css/styles";

type PlaceData = {
  [key: string]: {
    place: string;
    district: string;
    description?: string;
    image?: string;
  };
};

export default function PlaceCardList({ data }: { data?: PlaceData }) {
  if (!data) {
    return (
      <Text style={styles.loadingText}>Loading or no data available</Text>
    );
  }

  return (
    <View>
      {Object.entries(data).map(([key, val]) => (
        <TouchableOpacity
           key={key}
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: "/components/place/[id]",
              params: { id: key, details: JSON.stringify(val) }
            })
          } 
        >
          <Text style={styles.placeText}>📍 {val.place}</Text>
          <Text style={styles.districtText}>🏙️ {val.district}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
