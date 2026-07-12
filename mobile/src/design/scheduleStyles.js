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

    pickerPanel: {
      backgroundColor: colors.card,
      borderRadius: 18,
      marginBottom: 18,
      overflow: "hidden",
      padding: 8,
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

    hostRow: {
      alignItems: "center",
      flexDirection: "row-reverse",
      marginBottom: 14,
    },

    hostAvatar: {
      borderRadius: 24,
      height: 48,
      width: 48,
    },

    hostAvatarFallback: {
      alignItems: "center",
      backgroundColor: colors.selected,
      borderRadius: 24,
      height: 48,
      justifyContent: "center",
      width: 48,
    },

    hostInitial: {
      color: colors.primary,
      fontSize: 20,
      fontWeight: "800",
    },

    hostDetails: {
      alignItems: "flex-end",
      marginRight: 12,
    },

    hostName: {
      color: colors.text,
      fontSize: 17,
      fontWeight: "700",
      writingDirection: "rtl",
    },

    hostAge: {
      color: colors.secondaryText,
      fontSize: 14,
      marginTop: 2,
      writingDirection: "rtl",
    },

    sessionDetailsRow: {
      alignItems: "center",
      flexDirection: "row-reverse",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    sessionDate: {
      color: colors.secondaryText,
      fontSize: 14,
    },

    durationText: {
      color: colors.secondaryText,
      fontSize: 14,
    },

    playersCount: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
    },

    time: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: "700",
    },

    join: {
      color: "#FFFFFF",
      fontSize: 24,
      fontWeight: "700",
    },

    sessionActions: {
      alignItems: "center",
      flexDirection: "row-reverse",
      justifyContent: "space-between",
    },

    joinButton: {
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: 18,
      height: 36,
      justifyContent: "center",
      width: 36,
    },

    deleteButton: {
      alignItems: "center",
      backgroundColor: colors.background,
      borderRadius: 18,
      height: 36,
      justifyContent: "center",
      width: 36,
    },

    deleteButtonText: {
      fontSize: 18,
    },

    statusBadge: {
      backgroundColor: colors.selected,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },

    fullBadge: {
      opacity: 0.6,
    },

    statusText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: "700",
      writingDirection: "rtl",
    },

    playersButton: {
      borderColor: colors.primary,
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 7,
    },

    playersButtonText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: "600",
      writingDirection: "rtl",
    },

    participantsList: {
      borderTopColor: colors.border,
      borderTopWidth: 1,
      marginTop: 14,
      paddingTop: 10,
    },

    playerRow: {
      alignItems: "center",
      flexDirection: "row-reverse",
      marginTop: 8,
    },

    playerAvatar: {
      borderRadius: 18,
      height: 36,
      width: 36,
    },

    playerAvatarFallback: {
      alignItems: "center",
      backgroundColor: colors.selected,
      borderRadius: 18,
      height: 36,
      justifyContent: "center",
      width: 36,
    },

    playerInitial: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: "800",
    },

    playerDetails: {
      alignItems: "flex-end",
      marginRight: 10,
    },

    playerName: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "700",
    },

    playerAge: {
      color: colors.secondaryText,
      fontSize: 12,
      marginTop: 1,
    },

    error: {
      color: "#D42626",
      textAlign: "center",
      marginBottom: 10,
    },
  });
}
