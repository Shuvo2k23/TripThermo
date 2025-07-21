import styles from "@/assets/css/details";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
const GEMINI_API_KEY = "AIzaSyDR6QnPY3KOFhnGlRnROnNPHvuEhg3rc8w";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
  GEMINI_API_KEY;

export default function AIDescription({ data }: { data: any }) {
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    setLoading(true);

    const CACHE_KEY = `weather_${data.district}`;

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

      // Create Gemini prompt
      const prompt = `
        Place: ${data.place}, District: ${data.district}.
        Current weather: ${weatherCondition}.
        Temperature: ${temp}°C.
        UV Index: ${uv}.
        Wind Speed: ${wind} km/h.
        Chance of Rain Today: ${rainChance}%.

        Based on this weather data, is today suitable for traveling to ${data.place}? 
        Give a friendly 2-3 sentence recommendation. If yes, explain why. If not, explain why not.
        `;
      console.log("Gemini Prompt:", prompt);

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
        .catch(() => setDescription("Gemini API call failed."))
        .finally(() => setLoading(false));
    });
  }, [data]);

  return (
    <View>
        <Text style={styles.title}>🤖 AI Suggestions:</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text
          style={styles.description}
        >
          {description}
        </Text>
      )}
    </View>
  );
}
