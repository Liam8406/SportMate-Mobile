import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function BrandLogo({ size = 320, style }) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require("../Images/SportMate.png")}
        style={[
          styles.logo,
          {
            width: size,
            height: size * 0.34,
          },
        ]}
        resizeMode="contain"
        accessibilityLabel="SportMate logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    maxWidth: "100%",
  },
});
