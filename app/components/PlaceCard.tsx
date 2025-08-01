import styles from "@/assets/css/placeCard"; // You'll define custom styles here
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

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
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: image && image !== "" ? image : defaultImage,
        }}
        style={styles.image}
      />
      <Text style={styles.place}>{place}</Text>
      <Text style={styles.district}>📍 {district}</Text>
      <Text numberOfLines={2} style={styles.description}>
        {description || "No description yet."}
      </Text>
      {role === "admin" ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/components/edit/[id]",
              params: { id, details: JSON.stringify(data) },
            })
          }
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/components/place/[id]",
              params: { id, details: JSON.stringify(data) },
            })
          }
        >
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
