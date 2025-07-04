// components/RelatedPlaces.tsx
import { PlaceData } from "@/utils/usePlaceDetails";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PlaceCardList from "./PlaceCardLists";


type Props = {
  data?: PlaceData;
};

const RelatedPlaces = ({ data }: Props) => {
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
