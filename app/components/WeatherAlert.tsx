// components/WeatherAlert.tsx
import { useTheme } from '@/app/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type AlertProps = {
  alert: {
    headline: string;
    severity: string;
    event: string;
    desc: string;
    instruction: string;
  };
};

export default function WeatherAlert({ alert }: AlertProps) {
  const { theme } = useTheme();

  // Determine alert color based on severity
  const getAlertColor = () => {
    const severity = alert.severity?.toLowerCase();
    if (severity?.includes('extreme') || severity?.includes('severe')) {
      return '#dc2626'; // Red for extreme alerts
    } else if (severity?.includes('moderate')) {
      return '#ea580c'; // Orange for moderate alerts
    }
    return '#d97706'; // Amber for standard alerts
  };

  const alertColor = getAlertColor();

  // Check if dark mode is available, default to false if not
  const isDark = theme.mode === 'dark' ? theme.mode : false;

  const styles = StyleSheet.create({
    alertBox: {
      backgroundColor: isDark ? alertColor + '20' : alertColor + '10',
      padding: 20,
      borderRadius: 16,
      marginBottom: 20,
      borderLeftWidth: 6,
      borderLeftColor: alertColor,
      borderWidth: 1,
      borderColor: isDark ? alertColor + '40' : alertColor + '20',
      shadowColor: isDark ? '#000' : alertColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: isDark ? '#fef3c7' : alertColor,
      marginLeft: 8,
    },
    event: {
      fontSize: 18,
      fontWeight: "700",
      color: isDark ? '#ffffff' : '#7c2d12',
      marginBottom: 8,
      lineHeight: 24,
    },
    headline: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? '#fef3c7' : '#9a3412',
      marginBottom: 10,
      lineHeight: 22,
    },
    desc: {
      fontSize: 14,
      color: isDark ? '#e5e7eb' : '#7c2d12',
      marginBottom: 12,
      lineHeight: 20,
    },
    instruction: {
      fontSize: 14,
      color: isDark ? '#fef3c7' : '#9a3412',
      fontStyle: "italic",
      fontWeight: '500',
      lineHeight: 20,
      padding: 12,
      backgroundColor: isDark ? alertColor + '30' : alertColor + '15',
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: alertColor,
    },
    severityBadge: {
      backgroundColor: alertColor,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      marginTop: 8,
      alignSelf: 'flex-start',
    },
    severityText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
  });

  return (
    <View style={styles.alertBox}>
      <View style={styles.header}>
        <Ionicons name="warning" size={24} color={alertColor} />
        <Text style={styles.title}>WEATHER ALERT</Text>
      </View>

      {alert.event && (
        <Text style={styles.event}>⚠️ {alert.event}</Text>
      )}
      
      {alert.headline && (
        <Text style={styles.headline}>{alert.headline}</Text>
      )}
      
      {alert.desc && (
        <Text style={styles.desc}>{alert.desc}</Text>
      )}
      
      {alert.instruction && (
        <Text style={styles.instruction}>📋 {alert.instruction}</Text>
      )}
      
      {alert.severity && (
        <View style={styles.severityBadge}>
          <Text style={styles.severityText}>Severity: {alert.severity}</Text>
        </View>
      )}
    </View>
  );
}