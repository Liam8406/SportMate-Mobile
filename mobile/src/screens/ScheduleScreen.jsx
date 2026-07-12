import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DateTimePicker from "@react-native-community/datetimepicker";
import createStyles from "../design/scheduleStyles";
import sportLooks from "../lib/sportLooks";
import { useTheme } from "../theme/useTheme";
import api from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const formatLocalDate = (value) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setHours(23, 59, 59, 999);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
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
  const fieldId = field.id || field._id;

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState(90);

  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await api.get("/profile");
      setCurrentUser(userRes.data);

      if (fieldId) {
        const sessRes = await api.get(`/schedule/${fieldId}`);
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

      const bookingDate = formatLocalDate(date);
      const bookingTime = time.toTimeString().slice(0, 5);

      if (!fieldId) {
        setError("שדה לא תקין");
        return;
      }

      const res = await api.post(
        "/schedule/create",
        {
          fieldId,
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

      setSessions((prev) =>
        [...prev, res.data].sort((a, b) =>
          `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)
        )
      );
      setTime(new Date());
      setDuration(90);
      Alert.alert("המשחק נוצר", "המשחק נוסף לרשימת המשחקים הפתוחים");
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
    } catch (err) {
      Alert.alert("שגיאה", err.response?.data?.error || "שגיאה בהצטרפות");
    }
  };

  const deleteSession = (id) => {
    Alert.alert("מחיקת משחק", "האם למחוק את המשחק?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "מחיקה",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            await api.delete(`/schedule/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setSessions((prev) => prev.filter((session) => session._id !== id));
            setExpandedSessionId(null);
          } catch (err) {
            Alert.alert("שגיאה", err.response?.data?.error || "לא ניתן למחוק את המשחק");
          }
        },
      },
    ]);
  };

  const isHost = (s) =>
    currentUser && s.host?._id === currentUser._id;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: look.image }} style={styles.image} />

          <TouchableOpacity
            accessibilityLabel="חזרה"
            accessibilityRole="button"
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.headerIcon}>›</Text>
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
              onPress={() => {
                setShowTime(false);
                setShowDate(true);
              }}
            >
              <Text style={styles.bookingTitle}>תאריך</Text>
              <Text style={styles.bookingValue}>{date.toLocaleDateString("he-IL")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bookingCard}
              onPress={() => {
                setShowDate(false);
                setShowTime(true);
              }}
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
              const isFull = s.players.length >= s.maxPlayers;
              const isExpanded = expandedSessionId === s._id;

              return (
                <View key={s._id} style={styles.sessionCard}>
                  <View style={styles.hostRow}>
                    {s.host?.avatar ? (
                      <Image source={{ uri: s.host.avatar }} style={styles.hostAvatar} />
                    ) : (
                      <View style={styles.hostAvatarFallback}>
                        <Text style={styles.hostInitial}>
                          {(s.host?.username || "S").slice(0, 1).toUpperCase()}
                        </Text>
                      </View>
                    )}

                    <View style={styles.hostDetails}>
                      <Text style={styles.hostName}>{s.host?.username || "שחקן"}</Text>
                      <Text style={styles.hostAge}>
                        {s.host?.age ? `גיל ${s.host.age}` : "גיל לא צוין"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sessionDetailsRow}>
                    <Text style={styles.time}>{s.startTime}</Text>
                    <Text style={styles.durationText}>{s.durationMinutes} דק׳</Text>
                    <Text style={styles.sessionDate}>
                      {new Date(`${s.date}T12:00:00`).toLocaleDateString("he-IL")}
                    </Text>

                    <Text style={styles.playersCount}>
                      {s.players.length}/{s.maxPlayers}
                    </Text>
                  </View>

                  <View style={styles.sessionActions}>
                    <TouchableOpacity
                      accessibilityLabel={isExpanded ? "הסתרת רשימת השחקנים" : "הצגת רשימת השחקנים"}
                      accessibilityRole="button"
                      style={styles.playersButton}
                      onPress={() => setExpandedSessionId(isExpanded ? null : s._id)}
                    >
                      <Text style={styles.playersButtonText}>
                        {isExpanded ? "הסתר שחקנים" : "הצג שחקנים"}
                      </Text>
                    </TouchableOpacity>

                  {isHost(s) ? (
                    <TouchableOpacity
                      accessibilityLabel="מחיקת המשחק"
                      accessibilityRole="button"
                      style={styles.deleteButton}
                      onPress={() => deleteSession(s._id)}
                    >
                      <Text style={styles.deleteButtonText}>🗑</Text>
                    </TouchableOpacity>
                  ) : isParticipant ? (
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>רשום</Text>
                    </View>
                  ) : isFull ? (
                    <View style={[styles.statusBadge, styles.fullBadge]}>
                      <Text style={styles.statusText}>מלא</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      accessibilityLabel="הצטרפות למשחק"
                      accessibilityRole="button"
                      style={styles.joinButton}
                      onPress={() => joinSession(s._id)}
                    >
                      <Text style={styles.join}>+</Text>
                    </TouchableOpacity>
                  )}
                  </View>

                  {isExpanded ? (
                    <View style={styles.participantsList}>
                      {s.players.map((player) => (
                        <View key={player._id} style={styles.playerRow}>
                          {player.avatar ? (
                            <Image source={{ uri: player.avatar }} style={styles.playerAvatar} />
                          ) : (
                            <View style={styles.playerAvatarFallback}>
                              <Text style={styles.playerInitial}>
                                {(player.username || "S").slice(0, 1).toUpperCase()}
                              </Text>
                            </View>
                          )}
                          <View style={styles.playerDetails}>
                            <Text style={styles.playerName}>{player.username}</Text>
                            <Text style={styles.playerAge}>
                              {player.age ? `גיל ${player.age}` : "גיל לא צוין"}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              );
            })
          )}
        </View>

      </ScrollView>

      {showDate || showTime ? (
        <Modal
          animationType="fade"
          transparent
          visible={showDate || showTime}
          onRequestClose={() => {
            setShowDate(false);
            setShowTime(false);
          }}
        >
          <View style={styles.pickerModalBackdrop}>
            <View style={styles.pickerModalCard}>
              <Text style={styles.pickerModalTitle}>
                {showDate ? "בחירת תאריך" : "בחירת שעת התחלה"}
              </Text>

              {showDate ? (
                <View style={styles.dateChoices}>
                  {[new Date(), getTomorrow()].map((option, index) => {
                    const selected = formatLocalDate(date) === formatLocalDate(option);
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.dateChoice, selected && styles.dateChoiceSelected]}
                        onPress={() => setDate(option)}
                      >
                        <Text style={[styles.dateChoiceText, selected && styles.dateChoiceTextSelected]}>
                          {index === 0 ? "היום" : "מחר"} · {option.toLocaleDateString("he-IL")}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display={Platform.OS === "android" ? "clock" : "spinner"}
                  is24Hour
                  timeZoneName="Asia/Jerusalem"
                  onChange={(event, value) => {
                    if (Platform.OS === "android") setShowTime(false);
                    if (event.type !== "dismissed" && value) setTime(value);
                  }}
                />
              )}

              <TouchableOpacity
                style={styles.pickerConfirmButton}
                onPress={() => {
                  setShowDate(false);
                  setShowTime(false);
                }}
              >
                <Text style={styles.pickerConfirmText}>אישור</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
}
