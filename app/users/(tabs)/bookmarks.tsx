// app/user/bookmarks.tsx
import { useTheme } from '@/app/contexts/ThemeContext';
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const { theme } = useTheme();
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    if (!auth.currentUser) return;
    
    const bookmarksRef = ref(db, `bookmarks/${auth.currentUser.uid}`);
    onValue(bookmarksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookmarksList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setBookmarks(bookmarksList);
      } else {
        setBookmarks([]);
      }
    });
  }, []);

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: theme.colors.text,
    },
    emptyText: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 16,
      color: theme.colors.text + '99',
    },
    bookmarkItem: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    bookmarkImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 16,
    },
    bookmarkInfo: {
      flex: 1,
    },
    bookmarkName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    bookmarkDistrict: {
      fontSize: 14,
      color: theme.colors.text + 'CC',
      marginTop: 4,
    },
  });

  const renderBookmarkItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={dynamicStyles.bookmarkItem}
      onPress={() => {
        router.push({
          pathname: "/components/place/[id]",
          params: { id: item.id, details: JSON.stringify(item) }
        });
      }}
    >
      <Image 
        source={{ uri: item.image }} 
        style={dynamicStyles.bookmarkImage} 
        defaultSource={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQce_yi8YIsdo2ZFjEcCahx5IGiFNkprxP4og&s" }}
      />
      <View style={dynamicStyles.bookmarkInfo}>
        <Text style={dynamicStyles.bookmarkName}>{item.place}</Text>
        <Text style={dynamicStyles.bookmarkDistrict}>{item.district}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>My Bookmarks</Text>
      
      {bookmarks.length > 0 ? (
        <FlatList
          data={bookmarks}
          renderItem={renderBookmarkItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={dynamicStyles.emptyText}>No bookmarks yet</Text>
      )}
    </View>
  );
}