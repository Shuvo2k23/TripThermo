import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f4f8",
    flexGrow: 1,
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginTop: 20,
  },
  placeName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e88e5",
    marginBottom: 8,
    textAlign: "center",
  },
  district: {
    fontSize: 18,
    fontWeight: "500",
    color: "#616161",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: "#37474f",
    textAlign: "justify",
    marginTop: 8,
  },
  bold: {
    fontWeight: "bold",
    color: "#1e88e5",
  },
  relatedPlacesContainer: {
    marginTop: 32,
    marginBottom: 20,
  },
  relatedPlacesTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#263238",
    marginBottom: 14,
    paddingLeft: 4,
  },
  weatherCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginTop: 10,
  },
  weatherTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e40af', // strong blue
    marginBottom: 10,
  },
  forecastList: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#1e40af",
  },
});

export default styles;
