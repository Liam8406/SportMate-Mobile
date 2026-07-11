import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar, StyleSheet, View } from "react-native";

import BrandLogo from "../components/BrandLogo";

export default function SplashScreen({ navigation }) {

    useEffect(() => {
    checkLogin();
  }, []);

  async function checkLogin() {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <BrandLogo size={318} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
});
