// app/weather/index.tsx
import CurrentWeather from "@/app/components/CurrentWeather";
import ForecastList from "@/app/components/ForecastList";
import WeatherAlert from "@/app/components/WeatherAlert";
import { useTheme } from "@/app/contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Network from 'expo-network';
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AIDescription from "../../AIDescription";

const API_KEY = "7d4f09bbb1c746928a5132830252206"; // replace with your WeatherAPI key

export default function WeatherScreen() {
  const { place, district } = useLocalSearchParams<{
    place: string;
    district: string;
  }>();

  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [res, setRes] = useState<any>(null);
  const [showAIDescription, setShowAIDescription] = useState(false);
  const [hasError, setHasError] = useState(false);
  const CACHE_KEY = `weather_${district?.trim()}`;
  const CACHE_TIME = 1000 * 60 * 10; // 10 minutes cache
  
  const BACKGROUND_IMAGE = theme.mode === "dark"
    ? require('@/assets/images/night.jpg')
    : require('@/assets/images/day.jpg');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setHasError(false);
        
        // Check network connection
        const networkState = await Network.getNetworkStateAsync();
        if (!networkState.isConnected) {
          Alert.alert("No Internet", "Please check your internet connection and try again.");
          setHasError(true);
          setLoading(false);
          return;
        }

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

        // Fetch new data with HTTPS
        const res = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json`,
          {
            params: {
              key: API_KEY,
              q: district.toLocaleLowerCase() === "chattogram" ? "chittagong" : district,
              days: 7,
              alerts: "yes",
            },
            timeout: 10000, // 10 second timeout
          }
        );

        setRes(res);
        setCurrent(res.data.current);
        setForecast(res.data.forecast.forecastday);

        // Save to cache
        await AsyncStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: new Date().getTime(),
            data: res.data,
          })
        );
      } catch (err: any) {
        console.log("Failed to fetch weather", err);
        setHasError(true);
        
        // Try to use cached data if available
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setCurrent(parsed.data.current);
          setForecast(parsed.data.forecast.forecastday);
          setRes({ data: parsed.data });
          Alert.alert(
            "Using Cached Data", 
            "Could not fetch latest weather. Showing cached data."
          );
        } else {
          Alert.alert(
            "Error", 
            "Failed to load weather data. Please check your connection and try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (district) {
      fetchWeather();
    } else {
      setLoading(false);
      setHasError(true);
      Alert.alert("Error", "No location specified.");
    }
  }, [district]);

  const dynamicStyles = StyleSheet.create({
    aiButton: {
      backgroundColor: theme.colors.primary,
      padding: 12,
      borderRadius: 12,
      alignItems: "center",
      marginBottom: 16,
      marginTop: 8,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    aiButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
    },
    closeButton: {
      backgroundColor: theme.colors.notification || "#dc2626",
      padding: 12,
      borderRadius: 12,
      alignItems: "center",
      marginBottom: 16,
      marginTop: 8,
    },
    closeButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorText: {
      color: theme.colors.text,
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      padding: 12,
      borderRadius: 8,
    },
    retryButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
    },
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
        <Text style={{ color: theme.colors.text, marginTop: 10 }}>Loading weather data...</Text>
      </View>
    );
  }

  if (hasError && !current) {
    return (
      <ImageBackground
        source={BACKGROUND_IMAGE}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={[styles.container, dynamicStyles.errorContainer]}>
          <Text style={dynamicStyles.errorText}>
            Failed to load weather data. Please check your internet connection.
          </Text>
          <TouchableOpacity 
            style={dynamicStyles.retryButton}
            onPress={() => {
              setLoading(true);
              setHasError(false);
              const fetchWeather = async () => {
                // Your fetch weather function here
              };
              fetchWeather();
            }}
          >
            <Text style={dynamicStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={BACKGROUND_IMAGE}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.overlay,
            { backgroundColor: theme.colors.background + "90" },
          ]}
        />

        <View style={styles.content}>
          {current && <CurrentWeather data={res.data} />}

          {current && (
            <>
              {!showAIDescription ? (
                <TouchableOpacity
                  style={dynamicStyles.aiButton}
                  onPress={() => setShowAIDescription(true)}
                  activeOpacity={0.8}
                >
                  <Text style={dynamicStyles.aiButtonText}>
                    🤖 Get AI Suggestions 
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  <AIDescription district={district} place={place} />
                  <TouchableOpacity
                    style={dynamicStyles.closeButton}
                    onPress={() => setShowAIDescription(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={dynamicStyles.closeButtonText}>
                      ✕ Close AI Description
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}

          {res && res.data && res.data.alerts?.alert?.length > 0 && (
            <WeatherAlert alert={res.data.alerts.alert[0]} />
          )}

          {forecast && <ForecastList data={forecast} />}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  content: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    marginTop: StatusBar.currentHeight || 40,
    marginBottom: 40,
  },
});