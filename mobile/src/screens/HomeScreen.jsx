import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";

import api from "../../api";
import createStyles from "../design/homeStyles";
import { useTheme } from "../theme/useTheme";
import ScheduleScreen from "./ScheduleScreen";

const sports = [
  { id: "football", label: "כדורגל", value: "Football", icon: "⚽", color: "#6DDD73" },
  { id: "tennis", label: "טניס", value: "Tennis", icon: "🎾", color: "#ECFF2E" },
  { id: "all", label: "הכל", value: null, icon: "⌾", color: "#3ED7DA" },
  { id: "basketball", label: "כדורסל", value: "Basketball", icon: "🏀", color: "#FF842F" },
];

const sportLooks = {
  Football: {
    label: "מגרש כדורגל",
    image:
      "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=500&q=80",
  },
  Basketball: {
    label: "מגרש כדורסל",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=500&q=80",
  },
  Tennis: {
    label: "מגרש טניס",
    image:
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=500&q=80",
  },
  Field: {
    label: "מגרש",
    image:
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=500&q=80",
  },
};

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const getCoords = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("location-denied");
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
};

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);
  const [query, setQuery] = useState("");
  const [gpsCenter, setGpsCenter] = useState(null);
  const [activeCenter, setActiveCenter] = useState(null);
  const [fields, setFields] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hint, setHint] = useState("");
  const [pickedImage, setPickedImage] = useState(null);
  const [locationName, setLocationName] = useState("");
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const avatarUri = pickedImage?.uri || user?.avatar || null;
  const didInitRef = useRef(false);
  const canInteract = !(loading || loadingMore);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get("/profile");

      if (!response.data?.error) {
        setUser(response.data);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const fetchFields = useCallback(
    async (searchCoords, sport, token = "", originOverride = null) => {
      if (!searchCoords) return;

      if (!token) {
        setFields([]);
        setNextPageToken(null);
      }

      if (token) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setHint("");

      try {
        const origin = originOverride || gpsCenter || searchCoords;
        const response = await api.get("/api/fields", {
          params: {
            lat: searchCoords.lat,
            lng: searchCoords.lng,
            userLat: origin.lat,
            userLng: origin.lng,
            sport: sport || "All",
            pageToken: token,
          },
        });

        const items = response.data?.items || [];
        const next = response.data?.nextPageToken || null;

        setFields((current) => (token ? [...current, ...items] : items));
        setNextPageToken(next);

        if (items.length === 0 && !token) {
          setHint("לא נמצאו מגרשים באזור הזה");
        }
      } catch (err) {
        console.log("Fetch fields error:", err?.response?.data || err?.message || err);
        setHint("שגיאה בטעינת המגרשים");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [gpsCenter]
  );

  const resetToMyLocation = useCallback(async () => {
    if (!canInteract) return;

    setHint("");

    try {
      const gps = await getCoords();
      const places = await Location.reverseGeocodeAsync({
        latitude: gps.lat,
        longitude: gps.lng,
        });

        if (places.length > 0) {
        const place = places[0];

        setLocationName(
            place.city ||
            place.subregion ||
            place.region ||
            "המיקום שלי"
        );
      }
      setGpsCenter(gps);
      setActiveCenter(gps);
      setSelectedSport(null);
      setQuery("");
      await fetchFields(gps, null, "", gps);
    } 
    catch {
      setHint("צריך לאשר מיקום כדי להציג מגרשים קרובים");
    }
  }, [canInteract, fetchFields]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (didInitRef.current) return;

    didInitRef.current = true;
    resetToMyLocation();
  }, [resetToMyLocation]);

  const handleSearch = async () => {
    const text = query.trim();

    if (!text || !canInteract) return;

    setHint("");
    setLoading(true);

    try {
      const gps = await getCoords().catch(() => null);

      if (gps) {
        setGpsCenter(gps);
      }

      const response = await api.get("/geocode", {
        params: { q: text },
      });

      const searchCoords = {
        lat: response.data.lat,
        lng: response.data.lng,
      };

      setActiveCenter(searchCoords);
      await fetchFields(searchCoords, selectedSport, "", gps);
    } catch (err) {
      console.log("Geocode error:", err?.response?.data || err?.message || err);
      setHint("המיקום לא נמצא");
    } finally {
      setLoading(false);
    }
  };

  const handlePickSport = (sportValue) => {
    if (!canInteract) return;

    const nextSport = selectedSport === sportValue ? null : sportValue;
    setSelectedSport(nextSport);
    setHint("");

    if (!activeCenter) {
      setHint("אין מיקום עדיין");
      return;
    }

    fetchFields(activeCenter, nextSport, "");
  };

  const handleLoadMore = () => {
    if (!canInteract || !nextPageToken || !activeCenter) return;

    fetchFields(activeCenter, selectedSport, nextPageToken);
  };

  const renderSport = ({ item }) => {
    const active = selectedSport === item.value || (selectedSport === null && item.value === null);

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={!canInteract}
        onPress={() => handlePickSport(item.value)}
        style={styles.sportItem}
      >
        <View
          style={[
            styles.sportCircle,
            { backgroundColor: item.color },
            active && styles.sportCircleActive,
          ]}
        >
          <Text style={styles.sportIcon}>{item.icon}</Text>
        </View>
        <Text style={styles.sportLabel}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  const renderField = ({ item }) => {
    const look = sportLooks[item.sport] || sportLooks.Field;
    const title = item.name || look.label;
    const address = item.address || "כתובת לא ידועה";
    const distance = toNumber(item.distanceKm);

    return (
      <View style={styles.fieldCard}>
        <Image source={{ uri: look.image }} style={styles.fieldImage} />

        <View style={styles.fieldInfo}>
          <Text style={styles.fieldTitle} numberOfLines={2}>
            {title}
          </Text>

          <Text style={styles.fieldDistance} numberOfLines={1}>
            {distance !== null
              ? `במרחק של ${distance.toFixed(1)} קילומטר מהנוכחי`
              : "מרחק לא ידוע"}
          </Text>

          <Text style={styles.fieldAddress} numberOfLines={1}>
            {address}
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.bookButton}
            onPress={() => navigation.navigate("Schedule", {
                field: item,
            })}
          >
            <Text style={styles.bookButtonText}>קביעת משחק</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const listHeader = (
    <View>
      <View style={styles.header}>
        <Text style={styles.welcome}>ברוך הבא, {user?.username || "שחקן"}</Text>

        <View style={styles.locationRow}>
          <Text style={styles.locationPin}>●</Text>
        <Text style={styles.locationText}>
            {locationName || "טוען מיקום..."}
        </Text>
        </View>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            editable={canInteract}
            placeholder="חיפוש לפי עיר או רחוב"
            placeholderTextColor={colors.secondaryText}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            style={styles.searchInput}
          />

          {query.trim().length > 0 && (
            <TouchableOpacity disabled={!canInteract} onPress={resetToMyLocation}>
              <Text style={styles.clearSearch}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>סוגי מגרשים:</Text>

        <FlatList
          data={sports}
          keyExtractor={(item) => item.id}
          horizontal
          inverted
          showsHorizontalScrollIndicator={false}
          renderItem={renderSport}
          contentContainerStyle={styles.sportsList}
        />

        <Text style={styles.sectionTitle}>מגרשים:</Text>

        {hint ? <Text style={styles.hint}>{hint}</Text> : null}

        {loading && fields.length === 0 ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>טוען מגרשים...</Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  const listFooter = (
    <View style={styles.footer}>
      {nextPageToken ? (
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!canInteract}
          onPress={handleLoadMore}
          style={[styles.loadMoreButton, !canInteract && styles.disabledButton]}
        >
          <Text style={styles.loadMoreText}>{loadingMore ? "טוען..." : "טען עוד"}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={fields}
        keyExtractor={(item, index) => String(item.id || index)}
        renderItem={renderField}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading && fields.length > 0}
            onRefresh={() => fetchFields(activeCenter, selectedSport, "")}
            tintColor={colors.primary}
          />
        }
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity
            activeOpacity={0.85}
            style={styles.navItem}
            onPress={resetToMyLocation}
        >
            <Text style={[styles.navIcon, styles.navIconActive]}>
                ⌂
            </Text>
        </TouchableOpacity>

        <TouchableOpacity
            activeOpacity={0.85}
            style={styles.navItem}
            onPress={() => navigation.navigate("Settings")}
        >
            <Text style={styles.navIcon}>
                ⚙
            </Text>
        </TouchableOpacity>

        <TouchableOpacity
            activeOpacity={0.85}
            style={styles.navItem}
            onPress={() => navigation.navigate("Profile")}
            >
            <View style={styles.navAvatarWrap}>
                {avatarUri ? (
                <Image
                    source={{ uri: avatarUri }}
                    style={styles.navAvatar}
                />
                ) : (
                <View style={styles.navAvatarFallback}>
                    <Text style={styles.navAvatarInitial}>
                    {(user?.username || "S").slice(0, 1).toUpperCase()}
                    </Text>
                </View>
                )}
            </View>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}
