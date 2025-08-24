import { useTheme } from '@/app/contexts/ThemeContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  id: string;
  place: string;
  district: string;
  description?: string;
  image?: string;
  data: any;
};

export default function PlaceCard({
  id,
  place,
  district,
  description,
  image,
  data,
}: Props) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const { theme } = useTheme();
  
  const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQce_yi8YIsdo2ZFjEcCahx5IGiFNkprxP4og&s";
  
  useEffect(() => {
    const fetchRole = async () => {
      const userJson = await AsyncStorage.getItem("user");
      if (userJson) {
        const user = JSON.parse(userJson);
        setRole(user.role || null);
      }
    };
    fetchRole();
  }, []);

  // Create dynamic styles with theme
  const dynamicStyles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginHorizontal: 2,
      marginVertical: 5,
      flex: 1,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.border + '30',
    },
    image: {
      width: "100%",
      height: 120,
      borderRadius: 12,
      marginBottom: 12,
    },
    place: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 4,
      marginBottom: 4,
      color: theme.colors.text,
    },
    district: {
      fontSize: 14,
      color: theme.colors.text + 'CC',
      marginBottom: 8,
    },
    description: {
      fontSize: 13,
      marginVertical: 6,
      color: theme.colors.text + 'CC',
      lineHeight: 18,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 10,
      borderRadius: 8,
      marginTop: 8,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    buttonText: {
      color: "#FFFFFF",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 14,
    },
    adminButton: {
      backgroundColor: theme.colors.notification || '#FF3B30',
    },
    noDescriptionText: {
      color: theme.colors.text + '99',
      fontStyle: 'italic',
    },
  });

  return (
    <View style={dynamicStyles.card}>
      <Image
        source={{
          uri: image && image !== "" ? image : defaultImage,
        }}
        style={dynamicStyles.image}
      />
      <Text style={dynamicStyles.place}>{place}</Text>
      <Text style={dynamicStyles.district}>📍 {district}</Text>
      <Text numberOfLines={2} style={dynamicStyles.description}>
        {description || (
          <Text style={dynamicStyles.noDescriptionText}>No description yet.</Text>
        )}
      </Text>
      {role === "admin" ? (
        <TouchableOpacity
          style={[dynamicStyles.button, dynamicStyles.adminButton]}
          onPress={() =>
            router.push({
              pathname: "/components/edit/[id]",
              params: { id, details: JSON.stringify(data) },
            })
          }
        >
          <Text style={dynamicStyles.buttonText}>Edit</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={dynamicStyles.button}
          onPress={() =>
            router.push({
              pathname: "/components/place/[id]",
              params: { id, details: JSON.stringify(data) },
            })
          }
        >
          <Text style={dynamicStyles.buttonText}>View</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}