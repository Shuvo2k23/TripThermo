import { useTheme } from '@/app/contexts/ThemeContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const GEMINI_API_KEY = "AIzaSyDR6QnPY3KOFhnGlRnROnNPHvuEhg3rc8w";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
  GEMINI_API_KEY;

export default function AIDescription({ district, place }: { district: string; place: string }) {
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (!district || !place) return;
    setLoading(true);

    const CACHE_KEY = `weather_${district.trim()}`;

    AsyncStorage.getItem(CACHE_KEY).then((cached) => {
      if (!cached) {
        setDescription("Weather info not available. Please refresh.");
        setLoading(false);
        return;
      }

      const weatherData = JSON.parse(cached);

      // Extract weather info from cached API response
      const current = weatherData.data.current ?? {};
      const forecastDay = weatherData.data.forecast.forecastday[0].day ?? {};

      const weatherCondition = current.condition?.text || "Unknown";
      const temp = current.temp_c ?? "N/A";
      const uv = current.uv ?? "N/A";
      const wind = current.wind_kph ?? "N/A";
      const rainChance = forecastDay.daily_chance_of_rain ?? "N/A";
      const alerts = weatherData.data.alerts?.alert?.[0];
      const humidity = current.humidity ?? "N/A";

      const prompt = `
        Place: ${place}, District: ${district}.
        Current weather: ${weatherCondition}.
        Temperature: ${temp}°C.
        UV Index: ${uv}.
        Wind Speed: ${wind} km/h.
        Humidity: ${humidity}%.
        Chance of Rain Today: ${rainChance}%.
        ${alerts ? `Weather Alert: ${alerts.headline}. ${alerts.desc}` : ""}
        Based on this weather data${
          alerts ? " and the alert information above" : ""
        }, is today suitable for traveling to ${place}? 
        Give a friendly 2-3 sentence recommendation. If yes, explain why. If not, explain why not.
      `;
        
      fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      })
        .then((res) => res.json())
        .then((response) => {
          const desc =
            response?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No suggestion found.";
          setDescription(desc);
        })
        .catch(() => setDescription("⚠️ Something went wrong."))
        .finally(() => setLoading(false));
    });
  }, []);

  // Create dynamic styles with theme
  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card + 'CC', // CC = 80% opacity
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border + '50', // 50% opacity
      backdropFilter: 'blur(10px)', // This may not work on all React Native versions
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    description: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
      textAlign: 'center',
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>🤖 AI Travel Suggestion</Text>
      {loading ? (
        <View style={dynamicStyles.loadingContainer}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <Text style={dynamicStyles.description}>{description}</Text>
      )}
    </View>
  );
}