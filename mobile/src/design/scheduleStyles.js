import { StyleSheet } from "react-native";

export default function createStyles(colors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    imageContainer: {
      height: 320,
      overflow: "hidden",
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
    },

    image: {
      width: "100%",
      height: "100%",
    },

    backButton: {
      position: "absolute",
      top: 55,
      left: 20,
    },

    headerIcon: {
      color: "#FFFFFF",
      fontSize: 34,
      fontWeight: "700",
    },

    overlay: {
      position: "absolute",
      bottom: 30,
      left: 0,
      right: 0,
      backgroundColor: "rgba(255,255,255,0.75)",
      paddingVertical: 14,
      paddingHorizontal: 20,
    },

    fieldTitle: {
      color: "#111111",
      fontSize: 19,
      textAlign: "center",
      fontWeight: "700",
      writingDirection: "rtl",
    },

    container: {
      padding: 24,
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 26,
      fontWeight: "700",
      textAlign: "right",
      marginBottom: 14,
      writingDirection: "rtl",
    },

    bookingRow: {
      flexDirection: "row-reverse",
      justifyContent: "space-between",
      marginBottom: 18,
    },

    bookingCard: {
      width: "47%",
      backgroundColor: colors.card,
      borderRadius: 18,
      paddingVertical: 18,
      alignItems: "center",
      elevation: 4,
    },

    durationCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      paddingVertical: 18,
      alignItems: "center",
      marginBottom: 22,
      elevation: 4,
    },

    bookingTitle: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 8,
      writingDirection: "rtl",
    },

    bookingValue: {
      color: colors.secondaryText,
      fontSize: 17,
      writingDirection: "rtl",
    },

    durationRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 10,
    },

    durationBtn: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: colors.background,
    },

    activeDuration: {
      backgroundColor: colors.primary,
    },

    createButton: {
      height: 58,
      borderRadius: 30,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      elevation: 8,
      marginBottom: 35,
    },

    createButtonText: {
      color: "#FFFFFF",
      fontSize: 24,
      fontWeight: "800",
      writingDirection: "rtl",
    },

    emptyCard: {
      backgroundColor: colors.card,
      borderRadius: 22,
      paddingVertical: 40,
      alignItems: "center",
      elevation: 3,
      marginBottom: 30,
    },

    emptyTitle: {
      color: colors.text,
      fontSize: 21,
      fontWeight: "700",
      marginBottom: 10,
      writingDirection: "rtl",
    },

    sessionCard: {
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 16,
      marginBottom: 15,
    },

    time: {
      fontSize: 18,
      fontWeight: "700",
    },

    join: {
      fontSize: 22,
      color: colors.primary,
    },

    error: {
      color: "#D42626",
      textAlign: "center",
      marginBottom: 10,
    },
  });
}