import styles from "@/assets/css/currentWeather";
import React from "react";
import { Image, Text, View } from "react-native";
type Props = {
  data: {
    temp_c: number;
    feelslike_c: number;
    uv: number;
    condition: {
      text: string;
      icon: string;
    };
  };
};

export default function CurrentWeather({ data }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>Current Weather</Text>
        <Text style={styles.text}>🌡️ Temperature: {data.temp_c}°C</Text>
        <Text style={styles.text}>😌 Feels like: {data.feelslike_c}°C</Text>
        <Text style={styles.text}>🔆 UV Index: {data.uv}</Text>
        <Text style={styles.condition}>🌥️ {data.condition.text}</Text>
      </View>

      <Image
        source={{ uri: "https:" + data.condition.icon }}
        style={styles.icon}
      />
    </View>
  );
}
