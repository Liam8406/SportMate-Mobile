import { StyleSheet } from "react-native";

const blue = "#2F67C8";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },

  content: {
    paddingBottom: 40,
  },

  header: {
    backgroundColor: blue,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    height: 203,
    paddingHorizontal: 22,
    paddingTop: 44,
  },
  
  backButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 42,
    lineHeight: 42,
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },

  cardTitle: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "right",
  },

  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rowText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "600",
  },

  sportItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  sportItemActive: {
    backgroundColor: "#E9F0FF",
    borderRadius: 8,
  },

  sportText: {
    color: "#111111",
    fontSize: 15,
    textAlign: "left",
  },

  sportTextActive: {
    color: blue,
    fontWeight: "700",
  },

  saveButton: {
    backgroundColor: blue,
    marginTop: 25,
    marginHorizontal: 20,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  error: {
    color: "#D42626",
    textAlign: "center",
    marginTop: 12,
    fontWeight: "600",
  },

  success: {
    color: "#1E8E3E",
    textAlign: "center",
    marginTop: 12,
    fontWeight: "600",
  },
});