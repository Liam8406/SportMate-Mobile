import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import createStyles from "../design/scheduleStyles";
import { useTheme } from "../theme/useTheme";
import api from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const sportLooks = {
  Football: {
    label: "מגרש כדורגל",
    image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d",
  },
  Basketball: {
    label: "מגרש כדורסל",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
  },
  Tennis: {
    label: "מגרש טניס",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0",
  },
  Field: {
    label: "מגרש",
    image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e",
  },
};

export default function ScheduleScreen({ navigation, route }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const field = route?.params?.field ?? {
    _id: "",
    name: "מגרש",
    sport: "Field",
  };

  const look = sportLooks[field.sport] || sportLooks.Field;

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState(90);

  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await api.get("/profile");
      setCurrentUser(userRes.data);

      if (field._id) {
        const sessRes = await api.get(`/schedule/${field._id}`);
        setSessions(sessRes.data);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const createSession = async () => {
    try {
      setError("");

      const token = await AsyncStorage.getItem("token");

      const bookingDate = date.toISOString().split("T")[0];
      const bookingTime = time.toTimeString().slice(0, 5);

      if (!field._id) {
        setError("שדה לא תקין");
        return;
      }

      const res = await api.post(
        "/schedule/create",
        {
          fieldId: field._id,
          fieldName: field.name,
          sport: field.sport,
          date: bookingDate,
          startTime: bookingTime,
          duration: duration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSessions((prev) => [...prev, res.data]);
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.error || "שגיאה בקביעת משחק");
    }
  };

  const joinSession = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await api.post(
        `/schedule/${id}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSessions((prev) =>
        prev.map((s) => (s._id === id ? res.data : s))
      );
    } catch {
      alert("שגיאה בהצטרפות");
    }
  };

  const isHost = (s) =>
    currentUser && s.host?._id === currentUser._id;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: look.image }} style={styles.image} />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.headerIcon}>‹</Text>
          </TouchableOpacity>

          <View style={styles.overlay}>
            <Text style={styles.fieldTitle}>
              {look.label} • {field.address || ""}
            </Text>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.sectionTitle}>קביעת משחק</Text>

          <View style={styles.bookingRow}>
            <TouchableOpacity
              style={styles.bookingCard}
              onPress={() => setShowDate(true)}
            >
              <Text style={styles.bookingTitle}>תאריך</Text>
              <Text style={styles.bookingValue}>
                {date.toLocaleDateString("he-IL")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bookingCard}
              onPress={() => setShowTime(true)}
            >
              <Text style={styles.bookingTitle}>שעה</Text>
              <Text style={styles.bookingValue}>
                {time.toLocaleTimeString("he-IL", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.durationCard}>
            <Text style={styles.bookingTitle}>משך משחק</Text>

            <View style={styles.durationRow}>
              {[15, 30, 45, 60, 90].map((d) => {
                const active = duration === d;

                return (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setDuration(d)}
                    style={[
                      styles.durationBtn,
                      active && styles.activeDuration,
                    ]}
                  >
                    <Text
                      style={{
                        color: active ? "#fff" : colors.text,
                        fontWeight: "700",
                      }}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={createSession}
          >
            <Text style={styles.createButtonText}>
              קביעת משחק
            </Text>
          </TouchableOpacity>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.sectionTitle}>משחקים פתוחים</Text>

          {sessions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                אין משחקים כרגע
              </Text>
            </View>
          ) : (
            sessions.map((s) => {
              const isParticipant = s.players.some(
                (p) => p._id === currentUser?._id
              );

              return (
                <View key={s._id} style={styles.sessionCard}>
                  <Text style={styles.time}>{s.startTime}</Text>

                  <Text>
                    {s.players.length}/{s.maxPlayers}
                  </Text>

                  {isHost(s) ? (
                    <Text>אתה מארח</Text>
                  ) : isParticipant ? (
                    <Text>רשום</Text>
                  ) : (
                    <TouchableOpacity
                      onPress={() => joinSession(s._id)}
                    >
                      <Text style={styles.join}>+</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
        </View>

        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            minimumDate={new Date()}
            onChange={(e, d) => {
              setShowDate(false);
              if (d) setDate(d);
            }}
          />
        )}

        {showTime && (
          <DateTimePicker
            value={time}
            mode="time"
            onChange={(e, t) => {
              setShowTime(false);
              if (t) setTime(t);
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}