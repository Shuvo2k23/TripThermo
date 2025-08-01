// components/RelatedPlaces.tsx
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import PlaceCard from "./PlaceCard";


type PlaceData = {
  [key: string]: {
    place: string;
    district: string;
    description?: string;
    image?: string;
  };
};

const RelatedPlaces = ({ data }: { data?: PlaceData }) => {
  const dataArray = Object.entries(data || {});
  return (
    <FlatList
      data={dataArray}
      keyExtractor={([key]) => key}
      numColumns={2}
      contentContainerStyle={{padding: 16,}}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      
      ListHeaderComponent={() => (
        <View>
          <Text
            style={{ fontSize: 18, fontWeight: "bold", padding: 10 }}
          >
            Suggested Places:
          </Text>
        </View>
      )}
      renderItem={({ item }) => {
        const [key, val] = item;
        return (
          <PlaceCard
            id={key}
            place={val.place}
            district={val.district}
            description={val.description}
            image={val.image}
            data={val}
          />
        );
      }}
    />
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
