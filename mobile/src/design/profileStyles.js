import { StyleSheet } from "react-native";

export default function createStyles(colors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      flexGrow: 1,
      paddingBottom: 30,
    },

    loadingScreen: {
      alignItems: "center",
      backgroundColor: colors.background,
      flex: 1,
      justifyContent: "center",
    },

    loadingText: {
      color: colors.secondaryText,
      fontSize: 15,
      marginTop: 10,
      textAlign: "center",
      writingDirection: "rtl",
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
      height: 44,
      justifyContent: "center",
      width: 44,
    },

    backText: {
      color: "#FFFFFF",
      fontSize: 42,
      lineHeight: 42,
    },

    avatarWrap: {
      alignSelf: "center",
      backgroundColor: colors.card,
      borderRadius: 86,
      height: 172,
      justifyContent: "center",
      marginTop: -86,
      padding: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      width: 172,
      elevation: 9,
    },

    avatar: {
      borderRadius: 81,
      height: 162,
      width: 162,
    },

    avatarFallback: {
      alignItems: "center",
      backgroundColor: "#DFE8FF",
      borderRadius: 81,
      height: 162,
      justifyContent: "center",
      width: 162,
    },

    avatarInitial: {
      color: colors.primary,
      fontSize: 58,
      fontWeight: "900",
    },

    name: {
      color: colors.text,
      fontSize: 30,
      fontWeight: "900",
      marginTop: 15,
      textAlign: "center",
      writingDirection: "rtl",
    },

    emailPill: {
      alignSelf: "center",
      backgroundColor: colors.input,
      borderRadius: 14,
      color: colors.secondaryText,
      fontSize: 14,
      marginTop: 8,
      overflow: "hidden",
      paddingHorizontal: 14,
      paddingVertical: 4,
      textAlign: "center",
    },

    actionsRow: {
      alignItems: "center",
      flexDirection: "row-reverse",
      gap: 10,
      justifyContent: "center",
      marginTop: 18,
      paddingHorizontal: 24,
    },

    primaryButton: {
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: 13,
      height: 40,
      justifyContent: "center",
      minWidth: 132,
      paddingHorizontal: 16,
    },

    primaryButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "700",
      textAlign: "center",
      writingDirection: "rtl",
    },

    secondaryButton: {
      alignItems: "center",
      backgroundColor: colors.selected,
      borderColor: colors.primary,
      borderRadius: 13,
      borderWidth: 1,
      height: 40,
      justifyContent: "center",
      minWidth: 82,
      paddingHorizontal: 15,
    },

    secondaryButtonText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "800",
      textAlign: "center",
      writingDirection: "rtl",
    },

    card: {
      backgroundColor: colors.card,
      marginTop: 18,
      paddingHorizontal: 24,
      paddingVertical: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 10,
      elevation: 5,
    },

    cardHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },

    cardTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "800",
      marginBottom: 8,
      textAlign: "right",
      writingDirection: "rtl",
    },

    editText: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: "800",
      writingDirection: "rtl",
    },

    infoRow: {
      alignItems: "center",
      borderBottomColor: colors.divider,
      borderBottomWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      minHeight: 43,
    },

    infoLabel: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "700",
      textAlign: "right",
      writingDirection: "rtl",
    },

    infoValue: {
      color: colors.secondaryText,
      flex: 1,
      fontSize: 15,
      marginRight: 16,
      textAlign: "left",
    },

    inputGroup: {
      marginTop: 10,
    },

    inputLabel: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 7,
      textAlign: "right",
      writingDirection: "rtl",
    },

    input: {
      backgroundColor: colors.input,
      borderRadius: 13,
      color: colors.text,
      fontSize: 16,
      height: 49,
      paddingHorizontal: 15,
    },

    editActions: {
      flexDirection: "row-reverse",
      gap: 10,
      marginTop: 14,
    },

    saveDetailsButton: {
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: 13,
      flex: 1,
      height: 44,
      justifyContent: "center",
    },

    saveDetailsText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "800",
      textAlign: "center",
      writingDirection: "rtl",
    },

    cancelButton: {
      alignItems: "center",
      backgroundColor: colors.input,
      borderRadius: 13,
      flex: 1,
      height: 44,
      justifyContent: "center",
    },

    cancelText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "800",
      textAlign: "center",
      writingDirection: "rtl",
    },

    passwordButton: {
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: 13,
      height: 45,
      justifyContent: "center",
      marginTop: 15,
    },

    passwordButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "800",
      textAlign: "center",
      writingDirection: "rtl",
    },

    logoutButton: {
      alignItems: "center",
      backgroundColor: colors.danger,
      borderRadius: 13,
      height: 45,
      justifyContent: "center",
      marginTop: 15,
    },

    logoutButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "800",
      textAlign: "center",
      writingDirection: "rtl",
    },

    errorText: {
      color: colors.error,
      fontSize: 14,
      fontWeight: "700",
      marginTop: 14,
      paddingHorizontal: 24,
      textAlign: "center",
      writingDirection: "rtl",
    },

    successText: {
      color: colors.success,
      fontSize: 14,
      fontWeight: "700",
      marginTop: 14,
      paddingHorizontal: 24,
      textAlign: "center",
      writingDirection: "rtl",
    },
  });
}