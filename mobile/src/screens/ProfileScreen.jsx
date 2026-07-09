import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import api from "../../api";
import styles from "../design/profileStyles";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pickedImage, setPickedImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fillForm = useCallback((profile) => {
    setUsername(profile?.username || "");
    setEmail(profile?.email || "");
    setPhone(profile?.phone || "");
    setAge(profile?.age ? String(profile.age) : "");
  }, []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/profile");
      setUser(response.data);
      fillForm(response.data);
    } catch {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } finally {
      setLoading(false);
    }
  }, [fillForm, navigation]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const showMessage = (type, text) => {
    if (type === "error") {
      setError(text);
      setSuccess("");
    } else {
      setSuccess(text);
      setError("");
    }
  };

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== "granted") {
      showMessage("error", "צריך לאשר גישה לתמונות");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.75,
    });

    if (!result.canceled && result.assets?.[0]) {
      setPickedImage(result.assets[0]);
      setError("");
      setSuccess("");
    }
  };

  const saveAvatar = async () => {
    if (!pickedImage) return;

    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("avatar", {
      uri: pickedImage.uri,
      name: pickedImage.fileName || "avatar.jpg",
      type: pickedImage.mimeType || "image/jpeg",
    });

    try {
      const response = await api.post("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser((current) => ({ ...current, avatar: response.data.avatar }));
      setPickedImage(null);
      showMessage("success", "התמונה עודכנה בהצלחה");
    } catch (err) {
      showMessage("error", err?.response?.data?.error || "עדכון התמונה נכשל");
    } finally {
      setLoading(false);
    }
  };

  const saveDetails = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.put("/profile", {
        username,
        email,
        phone,
        age,
      });

      const refreshed = await api.get("/profile");
      setUser(refreshed.data);
      fillForm(refreshed.data);
      setEditMode(false);
      showMessage("success", "הפרטים עודכנו בהצלחה");
    } catch (err) {
      showMessage("error", err?.response?.data?.error || "עדכון הפרטים נכשל");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    fillForm(user);
    setEditMode(false);
    setError("");
    setSuccess("");
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword) {
      showMessage("error", "יש למלא את שתי הסיסמאות");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.put("/change-password", {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      showMessage("success", "הסיסמה עודכנה בהצלחה");
    } catch (err) {
      showMessage("error", err?.response?.data?.error || "עדכון הסיסמה נכשל");
    } finally {
      setLoading(false);
    }
  };

  const avatarUri = pickedImage?.uri || user?.avatar || null;

  if (loading && !user) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color="#2F67C8" />
        <Text style={styles.loadingText}>טוען פרופיל...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.safeArea}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.avatarWrap}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>
                {(user?.username || "S").slice(0, 1).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.name}>{user?.username || "משתמש"}</Text>
        <Text style={styles.emailPill}>{user?.email || ""}</Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.primaryButton} onPress={pickAvatar} disabled={loading}>
            <Text style={styles.primaryButtonText}>החלפת תמונה</Text>
          </TouchableOpacity>

          {pickedImage ? (
            <TouchableOpacity style={styles.secondaryButton} onPress={saveAvatar} disabled={loading}>
              <Text style={styles.secondaryButtonText}>שמירה</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>פרטים אישיים</Text>
            {!editMode ? (
              <TouchableOpacity onPress={() => setEditMode(true)}>
                <Text style={styles.editText}>עריכה</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {!editMode ? (
            <>
              <InfoRow label="שם משתמש" value={user?.username} />
              <InfoRow label="אימייל" value={user?.email} />
              <InfoRow label="טלפון" value={user?.phone || "-"} />
              <InfoRow label="גיל" value={user?.age || "-"} />
            </>
          ) : (
            <>
              <ProfileInput label="שם משתמש" value={username} onChangeText={setUsername} />
              <ProfileInput
                label="אימייל"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <ProfileInput
                label="טלפון"
                value={phone}
                onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                maxLength={10}
              />
              <ProfileInput
                label="גיל"
                value={age}
                onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                maxLength={3}
              />

              <View style={styles.editActions}>
                <TouchableOpacity style={styles.saveDetailsButton} onPress={saveDetails} disabled={loading}>
                  <Text style={styles.saveDetailsText}>שמירה</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit} disabled={loading}>
                  <Text style={styles.cancelText}>ביטול</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>שינוי סיסמה</Text>

          <ProfileInput
            label="סיסמה נוכחית"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          <ProfileInput
            label="סיסמה חדשה"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.passwordButton} onPress={changePassword} disabled={loading}>
            <Text style={styles.passwordButtonText}>
              {loading ? "מעדכן..." : "עדכון סיסמה"}
            </Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoValue}>{value || "-"}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
  );
}

function ProfileInput({ label, ...props }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor="#8F8F8F"
        style={styles.input}
        textAlign="right"
        writingDirection="rtl"
      />
    </View>
  );
}
