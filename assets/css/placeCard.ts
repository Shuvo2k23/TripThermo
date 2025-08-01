import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    margin: 8,
    flex: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
  place: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 6,
  },
  district: {
    fontSize: 14,
    color: "#666",
  },
  description: {
    fontSize: 12,
    marginVertical: 6,
    color: "#555",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 4,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
