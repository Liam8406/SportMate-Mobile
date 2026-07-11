import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import styles from "../design/settingsStyles";

const sports = ["None", "Football", "Basketball", "Volleyball", "Tennis"];

export default function SettingsScreen({ navigation }) {
  const [favSport, setFavSport] = useState("None");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    try {
      const res = await api.get("/profile");
      setFavSport(res.data?.favSport ?? "None");
    } catch {
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
    } catch {
      setError("שמירת ההעדפות נכשלה");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            כללי
          </Text>

          <View style={styles.row}>
            <Text style={styles.rowText}>
              מצב כהה
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            ספורט מועדף
          </Text>

          {sports.map((sport) => {
            const active = (favSport || "None") === sport;

            return (
              <TouchableOpacity
                key={sport}
                style={[
                  styles.sportItem,
                  active && styles.sportItemActive,
                ]}
                onPress={() => setFavSport(sport)}
              >
                <Text
                  style={[
                    styles.sportText,
                    active && styles.sportTextActive
                  ]}
                >
                  {sport}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={savePreferences}>
          <Text style={styles.saveText}>שמירת העדפות</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}