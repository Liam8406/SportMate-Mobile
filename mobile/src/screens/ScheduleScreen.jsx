import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

import createStyles from "../design/scheduleStyles";
import { useTheme } from "../theme/useTheme";

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

export default function ScheduleScreen({ navigation, route }) {

  const { colors } = useTheme();
  const styles = createStyles(colors);
  const field = route?.params?.field ?? {
    sport: "Field",
  };
  const look = sportLooks[field.sport] || sportLooks.Field;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
            <Image
                source={{
                    uri: look.image,
                }}
                style={styles.image}
            />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.headerIcon}>‹</Text>
          </TouchableOpacity>

          <View style={styles.overlay}>
            <Text style={styles.fieldTitle}>
                {look.label}
                {` • ${field.address}`}
            </Text>
          </View>

        </View>

        <View style={styles.container}>

          <Text style={styles.sectionTitle}>
            פרטי המגרש
          </Text>

          <Text style={styles.description}>
            מגרש פתוח ומטופח המתאים למשחקי חברים
            וקבוצות.
            {"\n\n"}
            כולל משטח דשא איכותי, תאורה לשעות
            הערב ומתאים לכל הרמות.
          </Text>

          <Text style={styles.sectionTitle}>
            קביעת משחק
          </Text>

          <View style={styles.bookingRow}>

            <TouchableOpacity style={styles.bookingCard}>
              <Text style={styles.bookingTitle}>תאריך</Text>
              <Text style={styles.bookingValue}>
                בחר תאריך
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bookingCard}>
              <Text style={styles.bookingTitle}>שעה</Text>
              <Text style={styles.bookingValue}>
                בחר שעה
              </Text>
            </TouchableOpacity>

          </View>

          <TouchableOpacity style={styles.durationCard}>
            <Text style={styles.bookingTitle}>
              משך משחק
            </Text>

            <Text style={styles.bookingValue}>
              90 דקות
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>
              קביעת משחק
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>
            משחקים שנקבעו
          </Text>

          <View style={styles.emptyCard}>

            <Text style={styles.emptyTitle}>
              אין משחקים כרגע
            </Text>

            <Text style={styles.emptySubtitle}>
              היה הראשון לקבוע משחק במגרש זה.
            </Text>
            
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}