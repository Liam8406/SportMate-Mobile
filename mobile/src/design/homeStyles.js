import { StyleSheet } from "react-native";

export default function createStyles(colors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    listContent: {
      paddingBottom: 118,
    },

    header: {
      alignItems: "center",
      backgroundColor: colors.primary,
      borderBottomLeftRadius: 26,
      borderBottomRightRadius: 26,
      minHeight: 214,
      paddingHorizontal: 22,
      paddingTop: 70,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.26,
      shadowRadius: 18,
      elevation: 12,
    },

    welcome: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "500",
      textAlign: "center",
      writingDirection: "rtl",
    },

    locationRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 7,
    },

    locationPin: {
      color: "#FFFFFF",
      fontSize: 14,
      lineHeight: 17,
      marginRight: 7,
    },

    locationText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "500",
      textAlign: "center",
      writingDirection: "rtl",
    },

    searchBar: {
      alignItems: "center",
      backgroundColor: colors.input,
      borderRadius: 22,
      bottom: -28,
      flexDirection: "row",
      height: 48,
      left: 22,
      paddingHorizontal: 17,
      position: "absolute",
      right: 22,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 9 },
      shadowOpacity: 0.32,
      shadowRadius: 10,
      elevation: 10,
    },

    searchIcon: {
      color: colors.text,
      fontSize: 28,
      fontWeight: "500",
      lineHeight: 30,
      marginRight: 8,
    },

    searchInput: {
      color: colors.text,
      flex: 1,
      fontSize: 14,
      height: "100%",
      paddingHorizontal: 8,
      textAlign: "right",
      writingDirection: "rtl",
    },

    clearSearch: {
      color: colors.secondaryText,
      fontSize: 24,
      fontWeight: "600",
      paddingLeft: 10,
    },

    content: {
      paddingHorizontal: 0,
      paddingTop: 42,
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "500",
      marginBottom: 16,
      paddingHorizontal: 24,
      textAlign: "right",
      writingDirection: "rtl",
    },

    sportsList: {
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 34,
    },

    sportItem: {
      flex: 0.05,
    },

    sportCircle: {
      alignItems: "center",
      borderRadius: 43,
      height: 86,
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 7 },
      shadowOpacity: 0.3,
      shadowRadius: 9,
      width: 86,
      elevation: 9,
    },

    sportCircleActive: {
      borderColor: colors.text,
      borderWidth: 3,
    },

    sportIcon: {
      color: colors.text,
      fontSize: 35,
      lineHeight: 39,
    },

    sportLabel: {
      color: colors.text,
      fontSize: 12,
      fontWeight: "500",
      marginTop: 8,
      textAlign: "center",
      writingDirection: "rtl",
    },

    hint: {
      color: colors.error,
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
      paddingHorizontal: 24,
      textAlign: "center",
      writingDirection: "rtl",
    },

    loadingBox: {
      alignItems: "center",
      backgroundColor: colors.card,
      marginHorizontal: 22,
      paddingVertical: 22,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 7 },
      shadowOpacity: 0.16,
      shadowRadius: 9,
      elevation: 7,
    },

    loadingText: {
      color: colors.secondaryText,
      fontSize: 14,
      marginTop: 8,
      textAlign: "center",
      writingDirection: "rtl",
    },

    fieldCard: {
      alignItems: "stretch",
      backgroundColor: colors.card,
      flexDirection: "row-reverse",
      minHeight: 190,
      marginBottom: 14,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.22,
      shadowRadius: 10,
      elevation: 8,
    },

    fieldImage: {
      height: 190,
      width: 150,
    },

    fieldInfo: {
      flex: 1,
      justifyContent: "center",
      paddingLeft: 16,
      paddingRight: 24,
    },

    fieldTitle: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: "500",
      lineHeight: 20,
      marginBottom: 9,
      textAlign: "right",
      writingDirection: "rtl",
    },

    fieldDistance: {
      color: colors.text,
      fontSize: 12,
      lineHeight: 19,
      marginBottom: 2,
      textAlign: "right",
      writingDirection: "rtl",
    },

    fieldAddress: {
      color: colors.secondaryText,
      fontSize: 11,
      lineHeight: 17,
      marginBottom: 11,
      textAlign: "right",
      writingDirection: "rtl",
    },

    fieldActions: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
    },

    bookButton: {
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: 12,
      flex: 1,
      height: 38,
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.28,
      shadowRadius: 5,
      elevation: 5,
    },

    mapsButton: {
      alignItems: "center",
      backgroundColor: colors.card,
      borderColor: colors.primary,
      borderRadius: 20,
      borderWidth: 2,
      height: 38,
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      width: 38,
      elevation: 4,
    },

    mapsButtonPressed: {
      backgroundColor: colors.primary,
      opacity: 0.65,
      transform: [{ scale: 0.88 }],
    },

    mapsButtonIcon: {
      fontSize: 22,
      lineHeight: 25,
      textAlign: "center",
    },

    bookButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "500",
      textAlign: "center",
      writingDirection: "rtl",
    },

    footer: {
      paddingHorizontal: 22,
      paddingTop: 8,
    },

    loadMoreButton: {
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: 14,
      height: 42,
      justifyContent: "center",
    },

    disabledButton: {
      opacity: 0.55,
    },

    loadMoreText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
      writingDirection: "rtl",
    },

    bottomNav: {
      alignItems: "center",
      backgroundColor: colors.card,
      borderTopLeftRadius: 31,
      borderTopRightRadius: 31,
      bottom: 0,
      flexDirection: "row",
      height: 76,
      justifyContent: "space-around",
      left: 0,
      paddingBottom: 12,
      paddingHorizontal: 58,
      position: "absolute",
      right: 0,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.13,
      shadowRadius: 10,
      elevation: 12,
    },

    navItem: {
      alignItems: "center",
      height: 44,
      justifyContent: "center",
      width: 76,
    },

    navIcon: {
      color: colors.secondaryText,
      fontSize: 33,
      fontWeight: "500",
      lineHeight: 36,
    },
    
    navAvatarWrap: {
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
    },

    navAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
    },

    navAvatarFallback: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "#DFE8FF",
      alignItems: "center",
      justifyContent: "center",
    },

    navAvatarInitial: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: "900",
    },

    navIconActive: {
      color: colors.primary,
    },
  });
}
