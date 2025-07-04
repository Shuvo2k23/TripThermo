import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

type Props = {
  data: any[];
};

export default function ForecastList({ data }: Props) {
  return (
    <View>
      <Text style={styles.title}>7-Day Forecast</Text>
      <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>{item.date}</Text>
            <Text>🌡️ {item.day.avgtemp_c}°C</Text>
            <Text>☁️ {item.day.condition.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1e40af",
  },
  card: {
    backgroundColor: "#eff6ff",
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    width: 120,
    alignItems: "center",
  },
  date: {
    fontWeight: "600",
    marginBottom: 4,
  },
});
