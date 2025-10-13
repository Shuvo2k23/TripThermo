import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const Index = () => {
  useEffect(()=>{
    const timer = setTimeout(() => {
      router.replace('/auth/login');
    }, 0);

    return () => clearTimeout(timer);
  });
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/icon.png')} // Replace with your logo
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to TripThermo</Text>
      <Text style={styles.description}>
        Discover places with real-time weather insights. TripThermo helps you decide the best time to visit your dream destinations.
      </Text>
      
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#0077b6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
