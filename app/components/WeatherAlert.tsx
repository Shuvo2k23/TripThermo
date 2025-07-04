// components/WeatherAlert.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type AlertProps = {
  alert: {
    headline: string;
    severity: string;
    event: string;
    desc: string;
    instruction: string;
  };
};

export default function WeatherAlert({ alert }: AlertProps) {
  return (
    <View style={styles.alertBox}>
      <Text style={styles.title}>⚠️ {alert.event}</Text>
      <Text style={styles.headline}>{alert.headline}</Text>
      <Text style={styles.desc}>{alert.desc}</Text>
      <Text style={styles.instruction}>{alert.instruction}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alertBox: {
    backgroundColor: "#fef3c7",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#facc15",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#b45309",
    marginBottom: 4,
  },
  headline: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 6,
  },
  desc: {
    color: "#78350f",
    marginBottom: 6,
  },
  instruction: {
    fontStyle: "italic",
    color: "#854d0e",
  },
});
