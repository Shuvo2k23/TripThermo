import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Horizontal layout
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
  },
  textBlock: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#1e40af",
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
    color: "#374151",
  },
  condition: {
    marginTop: 4,
    fontStyle: "italic",
    color: "#1e40df",
    fontWeight:600
  },
  icon: {
    width: 64,
    height: 64,
    resizeMode: "contain",
  },
});
export default styles;
