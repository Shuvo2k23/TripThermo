import { useTheme } from "@/app/contexts/ThemeContext";
import { StyleSheet } from "react-native";
  const { theme, toggleTheme, isDark } = useTheme();

// css/login.ts
export default StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: theme.colors.text,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 15,
    fontSize: 16,
    color: "#374151",
  },
  loginButton: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  signupPrompt: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
  },
  buttonWrapper: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 5,
  },
});
