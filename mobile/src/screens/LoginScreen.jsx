import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../design/authStyles";
import api from "../../api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");

  async function handleLogin() {
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
        setMessageColor("red");
        setMessage("יש למלא את כל השדות");
        return;
    }

    try {
        const response = await api.post("/login", {
            email: cleanEmail,
            password,
        });

        if (response.data.token) {
            await AsyncStorage.setItem("token", response.data.token);
        }

        setMessageColor("green");
        setMessage("התחברת בהצלחה");

        setTimeout(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
            });
        }, 800);

    } 
    catch (err) {
        console.log("LOGIN ERROR:");
        console.log(err.response?.data);
        console.log(err.message);

        setMessageColor("red");
        setMessage("האימייל או הסיסמה שגויים");
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../Images/SportMate.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>התחברות</Text>

      <TextInput
        style={styles.input}
        placeholder="אימייל"
        placeholderTextColor="#333"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        textAlign={email.length === 0 ? "right" : "left"}
        writingDirection="ltr"
      />

      <TextInput
        style={styles.input}
        placeholder="סיסמה"
        placeholderTextColor="#333"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textAlign={password.length === 0 ? "right" : "left"}
        writingDirection="ltr"
      />

      {message !== "" && (
        <Text
          style={{
            color: messageColor,
            fontSize: 15,
            marginBottom: 12,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {message}
        </Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          התחברות
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>
          אין לך חשבון קיים?
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.link}>
            הירשם
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}