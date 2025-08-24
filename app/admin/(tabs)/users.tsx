// app/admin/users.tsx
import { useTheme } from '@/app/contexts/ThemeContext';
import { db } from "@/firebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import { onValue, ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface User {
  uid: string;
  username: string;
  email: string;
  district: string;
  role: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setRefreshing(true);
    const usersRef = ref(db, 'users');
    
    onValue(usersRef, (snapshot) => {
      const usersData: User[] = [];
      
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          usersData.push({
            uid: childSnapshot.key || '',
            username: userData.username || 'No username',
            email: userData.email || 'No email',
            district: userData.district || 'Not set',
            role: userData.role || 'user',
            createdAt: userData.createdAt,
          });
        });
      }
      
      // Sort users by role (admin first) then by username
      const sortedUsers = usersData.sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (a.role !== 'admin' && b.role === 'admin') return 1;
        return a.username.localeCompare(b.username);
      });
      
      setUsers(sortedUsers);
      setLoading(false);
      setRefreshing(false);
    }, (error) => {
      Alert.alert("Error", "Failed to fetch users");
      setLoading(false);
      setRefreshing(false);
    });
  };

  const toggleUserRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    
    Alert.alert(
      "Change Role",
      `Are you sure you want to change ${user.username}'s role to ${newRole}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await update(ref(db, `users/${user.uid}`), {
                role: newRole
              });
              Alert.alert("Success", `Role updated to ${newRole}`);
            } catch (error) {
              Alert.alert("Error", "Failed to update role");
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 24,
      paddingBottom: 16,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.text + 'CC',
    },
    userCount: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
      marginTop: 8,
    },
    listContainer: {
      padding: 16,
    },
    userCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border + '30',
    },
    userHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    username: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      flex: 1,
    },
    roleBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginLeft: 12,
    },
    adminBadge: {
      backgroundColor: theme.colors.primary + '20',
    },
    userBadge: {
      backgroundColor: theme.colors.border,
    },
    roleText: {
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    adminText: {
      color: theme.colors.primary,
    },
    userText: {
      color: theme.colors.text + 'CC',
    },
    userInfo: {
      marginBottom: 8,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    infoText: {
      fontSize: 14,
      color: theme.colors.text + 'CC',
      marginLeft: 8,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 12,
      marginTop: 12,
      borderWidth: 1,
      borderColor: theme.colors.primary + '40',
    },
    promoteButton: {
      backgroundColor: theme.colors.primary + '20',
    },
    demoteButton: {
      backgroundColor: theme.colors.notification + '20',
    },
    buttonText: {
      marginLeft: 8,
      fontWeight: '600',
    },
    promoteText: {
      color: theme.colors.primary,
    },
    demoteText: {
      color: theme.colors.notification,
    },
    emptyState: {
      textAlign: 'center',
      color: theme.colors.text + '99',
      fontSize: 16,
      marginTop: 40,
      fontStyle: 'italic',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border + '30',
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.text + '99',
      marginTop: 4,
    },
  });

  const adminCount = users.filter(user => user.role === 'admin').length;
  const userCount = users.filter(user => user.role === 'user').length;

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={dynamicStyles.userCard}>
      <View style={dynamicStyles.userHeader}>
        <Text style={dynamicStyles.username} numberOfLines={1}>
          {item.username}
        </Text>
        <View style={[
          dynamicStyles.roleBadge,
          item.role === 'admin' ? dynamicStyles.adminBadge : dynamicStyles.userBadge
        ]}>
          <Text style={[
            dynamicStyles.roleText,
            item.role === 'admin' ? dynamicStyles.adminText : dynamicStyles.userText
          ]}>
            {item.role}
          </Text>
        </View>
      </View>

      <View style={dynamicStyles.userInfo}>
        <View style={dynamicStyles.infoRow}>
          <Ionicons name="mail" size={16} color={theme.colors.text + '99'} />
          <Text style={dynamicStyles.infoText} numberOfLines={1}>
            {item.email}
          </Text>
        </View>
        
        <View style={dynamicStyles.infoRow}>
          <Ionicons name="location" size={16} color={theme.colors.text + '99'} />
          <Text style={dynamicStyles.infoText}>
            {item.district}
          </Text>
        </View>
        
        <View style={dynamicStyles.infoRow}>
          <Ionicons name="calendar" size={16} color={theme.colors.text + '99'} />
          <Text style={dynamicStyles.infoText}>
            Joined: {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          dynamicStyles.actionButton,
          item.role === 'admin' ? dynamicStyles.demoteButton : dynamicStyles.promoteButton
        ]}
        onPress={() => toggleUserRole(item)}
      >
        <Ionicons
          name={item.role === 'admin' ? "arrow-down" : "arrow-up"}
          size={16}
          color={item.role === 'admin' ? theme.colors.notification : theme.colors.primary}
        />
        <Text style={[
          dynamicStyles.buttonText,
          item.role === 'admin' ? dynamicStyles.demoteText : dynamicStyles.promoteText
        ]}>
          {item.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.title}>User Management</Text>
        <Text style={dynamicStyles.subtitle}>Manage user roles and permissions</Text>
        <Text style={dynamicStyles.userCount}>
          {users.length} user{users.length !== 1 ? 's' : ''} total
        </Text>
      </View>

      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={dynamicStyles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchUsers}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <Text style={dynamicStyles.emptyState}>No users found</Text>
        }
        ListHeaderComponent={
          users.length > 0 ? (
            <View style={dynamicStyles.statsRow}>
              <View style={dynamicStyles.statItem}>
                <Text style={dynamicStyles.statNumber}>{adminCount}</Text>
                <Text style={dynamicStyles.statLabel}>Admins</Text>
              </View>
              <View style={dynamicStyles.statItem}>
                <Text style={dynamicStyles.statNumber}>{userCount}</Text>
                <Text style={dynamicStyles.statLabel}>Users</Text>
              </View>
              <View style={dynamicStyles.statItem}>
                <Text style={dynamicStyles.statNumber}>{users.length}</Text>
                <Text style={dynamicStyles.statLabel}>Total</Text>
              </View>
            </View>
          ) : null
        }
      />
    </View>
  );
}