import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../css/styles";

type PlaceData = {
  [key: string]: {
    place: string;
    district: string;
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
              pathname: `/place/${key}` as const,
              params: {
                place: val.place,
                district: val.district,
              },
            })
          } // ✅ navigate to dynamic route
        >
          <Text style={styles.placeText}>📍 {val.place}</Text>
          <Text style={styles.districtText}>🏙️ {val.district}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
