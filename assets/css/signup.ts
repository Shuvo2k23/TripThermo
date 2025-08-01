// css/signup.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F3F4F6",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 15,
    fontSize: 16,
    color: "#374151",
  },
  signupButton: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  loginPrompt: {
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 10,
    marginTop: 10,
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
