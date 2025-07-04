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
  const [res, SetRes] = useState<any>(null);
  useEffect(() => {
    const fetchWeather = async () => {
      try {
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
        SetRes(res);
        setCurrent(res.data.current);
        setForecast(res.data.forecast.forecastday);
      } catch (err) {
        console.log("Failed to fetch weather", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [district]);

  if (loading) {
    return <ActivityIndicator size="large" color="#2196F3" />;
  }

  return (
    <View style={styles.card}>
      <CurrentWeather data={current} />
      {res.data.alerts?.alert?.length > 0 && (
        <WeatherAlert alert={res.data.alerts.alert[0]} />
      )}
      <ForecastList data={forecast} />
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
