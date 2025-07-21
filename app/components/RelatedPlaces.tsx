// components/RelatedPlaces.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PlaceCardList from "./PlaceCardLists";


type PlaceData = {
  [key: string]: {
    place: string;
    district: string;
    description?: string;
    image?: string;
  };
};

const RelatedPlaces = ({ data }: { data?: PlaceData }) => {
  return (
    <View>
      <Text style={styles.title}>Related Places:</Text>
      {data && Object.keys(data).length > 0 ? (
        <PlaceCardList data={data} />
      ) : (
        <Text style={styles.empty}>No related places found.</Text>
      )}
    </View>
  );
};

export default RelatedPlaces;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 10,
  },
  empty: {
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
});
