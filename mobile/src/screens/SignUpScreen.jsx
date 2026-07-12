import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "../design/authStyles";
import api from "../../api";

// Collect details for a new account.
export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");

// Validate the form before registration.
async function handleRegister() {
    setMessage("");

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanAge = Number(age);

    if (!cleanUsername || !cleanEmail || !cleanPhone || !age || !password) {
        setMessageColor("red");
        setMessage("יש למלא את כל השדות");
        return;
    }

    if (cleanUsername.length < 3) {
        setMessageColor("red");
        setMessage("שם המשתמש חייב להכיל לפחות 3 תווים");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
        setMessageColor("red");
        setMessage("כתובת האימייל אינה תקינה");
        return;
    }

    if (cleanPhone.length !== 10) {
        setMessageColor("red");
        setMessage("מספר הטלפון חייב להכיל 10 ספרות");
        return;
    }

    if (cleanAge < 13 || cleanAge > 120) {
        setMessageColor("red");
        setMessage("הגיל חייב להיות בין 13 ל120");
        return;
    }

    if (password.length < 6) {
        setMessageColor("red");
        setMessage("הסיסמה חייבת להכיל לפחות 6 תווים");
        return;
    }

    try {
        await api.post("/register", {
            username: cleanUsername,
            email: cleanEmail,
            phone: cleanPhone,
            age: cleanAge,
            password,
        });

        const loginResponse = await api.post("/login", {
            email: cleanEmail,
            password,
        });

        if (loginResponse.data.token) {
            await AsyncStorage.setItem(
            "token",
            loginResponse.data.token
            );
        }

        setMessageColor("green");
        setMessage("נרשמת בהצלחה");

        setTimeout(() => {
            navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
            });
        }, 800);
    }
    catch (err) {
        console.log("REGISTER ERROR:");
        console.log(err.response?.data);
        console.log(err.message);

        setMessageColor("red");

        const error = err.response?.data?.error?.toLowerCase() || "";

        if (error.includes("email")) {
            setMessage("כתובת האימייל כבר קיימת");
        }
        else if (error.includes("phone")) {
            setMessage("מספר הטלפון כבר קיים");
        }
        else if (error.includes("username")) {
            setMessage("שם המשתמש כבר קיים");
        }
        else {
            setMessage("לא ניתן להשלים את ההרשמה");
        }
    }
  }

  return (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
        <View style={styles.container}>
        <Image
            source={require("../Images/SportMate.png")}
            style={styles.logo}
        />

        <Text style={styles.title}>הרשמה</Text>

        <TextInput
            style={styles.input}
            placeholder="שם מלא"
            placeholderTextColor="#333"
            value={username}
            onChangeText={setUsername}
            textAlign={username.length === 0 ? "right" : "left"}
            writingDirection="ltr"
        />

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
            placeholder="טלפון"
            placeholderTextColor="#333"
            value={phone}
            onChangeText={(text) =>
            setPhone(text.replace(/[^0-9]/g, ""))
            }
            keyboardType="number-pad"
            maxLength={10}
            textAlign={phone.length === 0 ? "right" : "left"}
            writingDirection="ltr"
        />

        <TextInput
            style={styles.input}
            placeholder="גיל"
            placeholderTextColor="#333"
            value={age}
            onChangeText={(text) =>
            setAge(text.replace(/[^0-9]/g, ""))
            }
            keyboardType="number-pad"
            maxLength={3}
            textAlign={age.length === 0 ? "right" : "left"}
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
            style={[
                styles.message,
                { color: messageColor },
            ]}
            >
            {message}
            </Text>
        )}

        <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
        >
            <Text style={styles.buttonText}>
            הרשמה
            </Text>
        </TouchableOpacity>

        <View style={styles.bottomContainer}>
            <Text style={styles.bottomText}>
            יש לך חשבון קיים?
            </Text>

            <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            >
            <Text style={styles.link}>
                התחבר
            </Text>
            </TouchableOpacity>
        </View>
        </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
}
