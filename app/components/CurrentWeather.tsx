// app/components/CurrentWeather.tsx
import { useTheme } from "@/app/contexts/ThemeContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface CurrentWeatherProps {
  data: any;
}

export default function CurrentWeather({ data }: CurrentWeatherProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card + "80", // 80% opacity (20% transparent)
      borderRadius: 5,
      padding: 24,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    location: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    temperature: {
      fontSize: 64,
      fontWeight: "300",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    condition: {
      fontSize: 18,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 16,
      textTransform: "capitalize",
      opacity: 0.9,
    },
    weatherIcon: {
      width: 100,
      height: 100,
      alignSelf: "center",
      marginBottom: 16,
    },
    detailsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 20,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border + "40",
    },
    detailItem: {
      alignItems: "center",
      minWidth: 80,
    },
    detailLabel: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: 6,
      opacity: 0.7,
      fontWeight: "500",
    },
    detailValue: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    icon: {
      marginBottom: 6,
      opacity: 0.8,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 12,
      textAlign: "center",
      opacity: 0.8,
    },
    highContrastDetailLabel: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: 6,
      fontWeight: "500",
    },
    highContrastDetailValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.temperature}>
        {Math.round(data?.current.temp_c)}°C
      </Text>
      <Text style={styles.condition}>{data.current?.condition?.text}</Text>

      {data.current?.condition?.icon && (
        <Image
          source={{ uri: `https:${data.current.condition.icon}` }}
          style={styles.weatherIcon}
          resizeMode="contain"
        />
      )}

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons
            name="water-outline"
            size={20}
            color={theme.colors.text + "99"}
            style={styles.icon}
          />
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{data.current?.humidity}%</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons
            name="speedometer-outline"
            size={20}
            color={theme.colors.text + "99"}
            style={styles.icon}
          />
          <Text style={styles.detailLabel}>Pressure</Text>
          <Text style={styles.detailValue}>{data.current?.pressure_mb}hPa</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons
            name="eye-outline"
            size={20}
            color={theme.colors.text + "99"}
            style={styles.icon}
          />
          <Text style={styles.detailLabel}>Visibility</Text>
          <Text style={styles.detailValue}>{data.current?.vis_km}km</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons
            name="arrow-up-outline"
            size={20}
            color={theme.colors.text + "99"}
            style={styles.icon}
          />
          <Text style={styles.detailLabel}>Max Temp</Text>
          <Text style={styles.detailValue}>
            {Math.round(data.forecast?.forecastday[0]?.day?.maxtemp_c)}°C
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons
            name="arrow-down-outline"
            size={20}
            color={theme.colors.text + "99"}
            style={styles.icon}
          />
          <Text style={styles.detailLabel}>Min Temp</Text>
          <Text style={styles.detailValue}>
            {Math.round(data.forecast?.forecastday[0]?.day?.mintemp_c)}°C
          </Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialIcons
            name="air"
            size={20}
            color={theme.colors.text + "99"}
            style={styles.icon}
          />
          <Text style={styles.detailLabel}>Wind</Text>
          <Text style={styles.detailValue}>{data.current?.wind_kph}km/h</Text>
        </View>
      </View>
    </View>
  );
}
