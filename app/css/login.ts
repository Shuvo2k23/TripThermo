import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  buttonWrapper: {
    padding: 10, // ⬅️ Padding inside the wrapper
    marginTop: 10, // Optional space above
  },
});
export default styles;