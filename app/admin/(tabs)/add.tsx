import { useTheme } from '@/app/contexts/ThemeContext';
import { db } from "@/firebaseConfig";
import { ref, set } from "firebase/database";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Add() {
  const [place, setPlace] = useState("");
  const [district, setDistrict] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const dataAdd = async () => {
    if (place.trim() !== "" && district.trim() !== "") {
      setLoading(true);
      try {
        // Generate a unique key for the place
        const placeKey = place.toLowerCase().replace(/\s+/g, '_');
        
        await set(ref(db, "places/" + placeKey), {
          place,
          district,
          description: description.trim() || "",
          image: image.trim() || "",
        });
        
        Alert.alert("Success", "Place added successfully!");
        setPlace("");
        setDistrict("");
        setDescription("");
        setImage("");
      } catch (error) {
        Alert.alert("Error", "Failed to add place. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Error", "Place name and district are required.");
    }
  };

  // Dynamic styles with theme
  const dynamicStyles = StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      padding: 24,
      justifyContent: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 32,
    },
    inputContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border + '30',
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
      marginTop: 16,
    },
    required: {
      color: theme.colors.notification || '#dc2626',
    },
    input: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 16,
    },
    textArea: {
      minHeight: 120,
      textAlignVertical: 'top',
    },
    characterCount: {
      fontSize: 12,
      color: theme.colors.text + '99',
      textAlign: 'right',
      marginBottom: 16,
      marginTop: -8,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 24,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    addButtonDisabled: {
      backgroundColor: theme.colors.border,
      opacity: 0.7,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    resetButton: {
      backgroundColor: theme.colors.border,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 12,
    },
    resetButtonText: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    successIcon: {
      textAlign: 'center',
      fontSize: 48,
      marginBottom: 16,
    },
  });

  const isFormValid = place.trim() !== "" && district.trim() !== "";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={dynamicStyles.page}>
          <ScrollView contentContainerStyle={dynamicStyles.scrollContainer}>
            <Text style={dynamicStyles.title}> Add New Place</Text>

            <View style={dynamicStyles.inputContainer}>
              <Text style={dynamicStyles.label}>
                Place Name <Text style={dynamicStyles.required}>*</Text>
              </Text>
              <TextInput
                style={dynamicStyles.input}
                placeholder="Enter place name..."
                placeholderTextColor={theme.colors.text + '99'}
                value={place}
                onChangeText={setPlace}
                maxLength={50}
              />
              <Text style={dynamicStyles.characterCount}>
                {place.length}/50 characters
              </Text>

              <Text style={dynamicStyles.label}>
                District Name <Text style={dynamicStyles.required}>*</Text>
              </Text>
              <TextInput
                style={dynamicStyles.input}
                placeholder="Enter district name..."
                placeholderTextColor={theme.colors.text + '99'}
                value={district}
                onChangeText={setDistrict}
                maxLength={30}
              />
              <Text style={dynamicStyles.characterCount}>
                {district.length}/30 characters
              </Text>

              <Text style={dynamicStyles.label}>Description</Text>
              <TextInput
                style={[dynamicStyles.input, dynamicStyles.textArea]}
                placeholder="Enter description (optional)..."
                placeholderTextColor={theme.colors.text + '99'}
                value={description}
                onChangeText={setDescription}
                multiline={true}
                maxLength={200}
              />
              <Text style={dynamicStyles.characterCount}>
                {description.length}/200 characters
              </Text>

              <Text style={dynamicStyles.label}>Image URL</Text>
              <TextInput
                style={dynamicStyles.input}
                placeholder="Enter image URL (optional)..."
                placeholderTextColor={theme.colors.text + '99'}
                value={image}
                onChangeText={setImage}
                maxLength={500}
                keyboardType="url"
                autoCapitalize="none"
              />
              <Text style={dynamicStyles.characterCount}>
                {image.length}/500 characters
              </Text>

              <TouchableOpacity 
                onPress={dataAdd}
                style={[
                  dynamicStyles.addButton,
                  (!isFormValid || loading) && dynamicStyles.addButtonDisabled
                ]}
                disabled={!isFormValid || loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={dynamicStyles.addButtonText}>
                     Add Place
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => {
                  setPlace("");
                  setDistrict("");
                  setDescription("");
                  setImage("");
                }} 
                style={dynamicStyles.resetButton}
                activeOpacity={0.8}
              >
                <Text style={dynamicStyles.resetButtonText}> Reset Form</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Loading Overlay */}
          {loading && (
            <View style={dynamicStyles.loadingOverlay}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}