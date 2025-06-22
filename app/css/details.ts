import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f4f9ff",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },
  placeName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#24a0ed",
    marginBottom: 8,
    textAlign: "center",
  },
  district: {
    fontSize: 18,
    fontWeight: "500",
    color: "#444",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    textAlign: "justify",
  },
  bold: {
    fontWeight: "bold",
    color: "#24a0ed",
  },
});

export default styles;
