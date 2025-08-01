import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import CurrentWeather from "./CurrentWeather";
import ForecastList from "./ForecastList";
import WeatherAlert from "./WeatherAlert";

const API_KEY = "7d4f09bbb1c746928a5132830252206"; // replace with your WeatherAPI key

type Props = {
  district: string;
};

export default function WeatherCard({ district }: Props) {
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [res, setRes] = useState<any>(null);

  const CACHE_KEY = `weather_${district}`;
  const CACHE_TIME = 1000 * 60 * 10; // 10 minutes cache

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);

        if (cached) {
          const parsed = JSON.parse(cached);
          const now = new Date().getTime();

          if (now - parsed.timestamp < CACHE_TIME) {
            // Use cached data
            setCurrent(parsed.data.current);
            setForecast(parsed.data.forecast.forecastday);
            setRes({ data: parsed.data });
            setLoading(false);
            return;
          }
        }

        // Fetch new data
        const res = await axios.get(
          `http://api.weatherapi.com/v1/forecast.json`,
          {
            params: {
              key: API_KEY,
              q: district,
              days: 7,
              alerts: "yes",
            },
          }
        );

        setRes(res);
        setCurrent(res.data.current);
        setForecast(res.data.forecast.forecastday);
        // console.log(res.data);

        // Save to cache
        await AsyncStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: new Date().getTime(),
            data: res.data,
          })
        );
      } catch (err) {
        // console.log("Failed to fetch weather", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#2196F3" />;
  }

  return (
    <View style={styles.card}>
      {current && <CurrentWeather data={current} />}
      {res && res.data && res.data.alerts?.alert?.length > 0 && (
        <WeatherAlert alert={res.data.alerts.alert[0]} />
      )}
      {forecast && <ForecastList data={forecast} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    elevation: 4,
  },
});
