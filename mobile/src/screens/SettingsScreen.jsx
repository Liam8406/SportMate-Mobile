import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import api from "../../api";
import createStyles from "../design/settingsStyles";
import { useTheme } from "../theme/useTheme";

const sports = [
  { value: "None", label: "ללא" },
  { value: "Football", label: "כדורגל" },
  { value: "Basketball", label: "כדורסל" },
  { value: "Volleyball", label: "כדורעף" },
  { value: "Tennis", label: "טניס" },
];

export default function SettingsScreen({ navigation }) {
  const [favSport, setFavSport] = useState("None");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { colors, darkMode, toggleTheme } = useTheme();
  const styles = createStyles(colors);

  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    try {
      const res = await api.get("/profile");
      setFavSport(res.data?.favSport ?? "None");
    } 
    catch {
      setError("טעינת ההעדפות נכשלה");
    }
  }

  async function savePreferences() {
    setError("");
    setSuccess("");

    try {
      await api.put("/profile", {
        favSport,
      });

      setSuccess("ההעדפות נשמרו בהצלחה");
    } 
    catch {
      setError("שמירת ההעדפות נכשלה");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            כללי
          </Text>

          <View style={styles.row}>
            <Text style={styles.rowText}>
              מצב לילה
            </Text>
              <Switch
                value={darkMode}
                onValueChange={toggleTheme}
                trackColor={{
                    false: "#D1D5DB",
                    true: colors.primary,
                }}
                thumbColor="#FFFFFF"
              />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            ספורט מועדף
          </Text>

          {sports.map((sport) => {
            const active = (favSport || "None") === sport.value;

            return (
              <TouchableOpacity
                key={sport.value}
                style={[
                  styles.sportItem,
                  active && styles.sportItemActive,
                ]}
                onPress={() => setFavSport(sport.value)}
              >
                <Text
                  style={[
                    styles.sportText,
                    active && styles.sportTextActive,
                  ]}
                >
                  {sport.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={savePreferences}
        >
          <Text style={styles.saveText}>
            שמירת העדפות
          </Text>
        </TouchableOpacity>

        {error ? (
          <Text style={styles.error}>
            {error}
          </Text>
        ) : null}

        {success ? (
          <Text style={styles.success}>
            {success}
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
