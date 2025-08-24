// app/components/ForecastList.tsx
import { useTheme } from '@/app/contexts/ThemeContext';
import React from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

type Props = {
  data: any[];
};

export default function ForecastList({ data }: Props) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginTop: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 16,
      color: theme.colors.text,
      marginLeft: 4,
    },
    card: {
      backgroundColor: theme.colors.card + "80",
      padding: 16,
      marginRight: 12,
      borderRadius: 1,
      width: 140,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
      borderWidth: 2,
      borderColor: theme.colors.border + '80',
    },
    date: {
      fontWeight: "600",
      marginBottom: 8,
      color: theme.colors.text,
      fontSize: 14,
      textAlign: 'center',
    },
    temperature: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 6,
    },
    condition: {
      fontSize: 12,
      color: theme.colors.text + 'CC',
      textAlign: 'center',
      marginTop: 4,
      textTransform: 'capitalize',
    },
    weatherIcon: {
      width: 40,
      height: 40,
      marginVertical: 8,
    },
    tempRange: {
      fontSize: 12,
      color: theme.colors.text + '99',
      marginTop: 4,
    },
  });

  // Format date to show day name (e.g., "Mon", "Tue")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>3-Day Forecast</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
            
            {item.day.condition.icon && (
              <Image
                source={{ uri: `https:${item.day.condition.icon}` }}
                style={styles.weatherIcon}
                resizeMode="contain"
              />
            )}
            
            <Text style={styles.temperature}>{Math.round(item.day.avgtemp_c)}°C</Text>
            
            <Text style={styles.tempRange}>
              H: {Math.round(item.day.maxtemp_c)}° • L: {Math.round(item.day.mintemp_c)}°
            </Text>
            
            <Text style={styles.condition} numberOfLines={2}>
              {item.day.condition.text}
            </Text>
          </View>
        )}
      />
    </View>
  );
}