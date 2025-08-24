import PlaceCard from "@/app/components/PlaceCard";
import SearchBox from "@/app/components/SearchBox";
import { useTheme } from '@/app/contexts/ThemeContext';
import { auth, db } from "@/firebaseConfig";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

export default function Landing() {
  const [data, setData] = useState<PlaceData>();
  const [dataArray, setDataArray] = useState<[string, any][]>([]);
  const [userDistrict, setUserDistrict] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
  
  type PlaceData = {
    [key: string]: {
      place: string;
      district: string;
      description?: string;
      image?: string;
    };
  };

  const getPlaces = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.log("No user is logged in");
        return;
      }

      const userRef = ref(db, "users/" + uid);
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        console.log("User not found in database");
        return;
      }

      const userData = userSnapshot.val();
      const userDistrict = userData.district;
      const isAdmin = userData.role === "admin";

      setUserDistrict(userDistrict);

      const placesRef = ref(db, "places/");
      const snapshot = await get(placesRef);

      const data = snapshot.val();
      if (!data) {
        setData(undefined);
        return;
      }

      setData(data);

      if (isAdmin) {
        setDataArray(Object.entries(data));
      } else {
        const filteredEntries = Object.entries(data).filter(
          ([, place]: [string, any]) =>
            place.district.trim().toLowerCase() ===
            userDistrict.trim().toLowerCase()
        );

        const filtered: PlaceData = {};
        filteredEntries.forEach(([key, value]) => {
          filtered[key] = value as PlaceData[string];
        });

        setDataArray(Object.entries(filtered));
      }
    } catch (err) {
      console.log("Error loading data:", err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getPlaces();
    setRefreshing(false);
  };
  
  useEffect(() => {
    onRefresh();
  }, []);

  // Dynamic styles with theme
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 1,
      paddingBottom: 40,
    },
    content: {
      padding: 1,
    },
    headerText: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      padding: 16,
      paddingBottom: 8,
      marginTop: 10,
    },
    subHeaderText: {
      fontSize: 16,
      color: theme.colors.text + 'CC',
      paddingHorizontal: 16,
      paddingBottom: 16,
      marginTop: -8,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      padding: 16,
      paddingBottom: 8,
      marginTop: 20,
    },
    searchSection: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      margin: 16,
      marginBottom: 8,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border + '30',
    },
    emptyState: {
      textAlign: 'center',
      color: theme.colors.text + '99',
      fontSize: 16,
      marginTop: 40,
      fontStyle: 'italic',
      padding: 20,
    },
    userDistrictBadge: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'flex-start',
      marginHorizontal: 16,
      marginBottom: 16,
    },
    userDistrictText: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    adminBadge: {
      backgroundColor: theme.colors.notification + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'flex-start',
      marginHorizontal: 16,
      marginBottom: 16,
    },
    adminText: {
      color: theme.colors.notification,
      fontSize: 14,
      fontWeight: '600',
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <FlatList
        data={dataArray}
        keyExtractor={([key]) => key}
        numColumns={2}
        contentContainerStyle={dynamicStyles.content}
        columnWrapperStyle={{ justifyContent: "space-between", gap: 12 }}
        showsVerticalScrollIndicator={false} 
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListHeaderComponent={() => (
          <View>
            {/* Welcome Header */}
            <Text style={dynamicStyles.headerText}>Welcome!</Text>
            <Text style={dynamicStyles.subHeaderText}>
              Discover amazing places in your area
            </Text>

            {/* User Role/District Badge */}
            {userDistrict && (
              <View style={dynamicStyles.userDistrictBadge}>
                <Text style={dynamicStyles.userDistrictText}>
                  📍 Your District: {userDistrict}
                </Text>
              </View>
            )}

            
            {/* Search Section */}
            <View style={dynamicStyles.searchSection}>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: "bold", 
                color: theme.colors.text,
                marginBottom: 12 
              }}>
                Search Places:
              </Text>
              {data && <SearchBox data={data ?? {}} />}
            </View>

            {/* Places List Header */}
            <Text style={dynamicStyles.sectionTitle}>
              {dataArray.length > 0 ? 'Available Places' : 'No Places Found'}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={dynamicStyles.emptyState}>
            {userDistrict ? 
              `No places found in ${userDistrict}. Check back later!` : 
              'Loading places...'
            }
          </Text>
        )}
        renderItem={({ item }) => {
          const [key, val] = item;
          return (
            <PlaceCard
              id={key}
              place={val.place}
              district={val.district}
              description={val.description}
              image={val.image}
              data={val}
            />
          );
        }}
      />
    </View>
  );
}