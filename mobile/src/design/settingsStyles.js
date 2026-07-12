import { StyleSheet } from "react-native";

export default function createStyles(colors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      paddingBottom: 40,
    },

    header: {
      backgroundColor: colors.primary,
      borderBottomLeftRadius: 26,
      borderBottomRightRadius: 26,
      height: 203,
      paddingHorizontal: 22,
      paddingTop: 44,
    },

    backButton: {
      alignItems: "center",
      alignSelf: "flex-end",
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
      backgroundColor: colors.card,
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
      color: colors.text,
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
      color: colors.text,
      fontSize: 15,
      fontWeight: "600",
      textAlign: "right",
    },

    sportItem: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    sportItemActive: {
      backgroundColor: colors.selected,
      borderRadius: 8,
    },

    sportText: {
      color: colors.text,
      fontSize: 15,
      textAlign: "right",
    },

    sportTextActive: {
      color: colors.primary,
      fontWeight: "700",
    },

    saveButton: {
      backgroundColor: colors.primary,
      marginTop: 25,
      marginHorizontal: 20,
      height: 48,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },

    saveText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },

    error: {
      color: colors.error,
      textAlign: "center",
      marginTop: 12,
      fontWeight: "600",
    },

    success: {
      color: colors.success,
      textAlign: "center",
      marginTop: 12,
      fontWeight: "600",
    },

    logoutButton: {

    },

    logoutButtonText: {

    },
    
  });
}
