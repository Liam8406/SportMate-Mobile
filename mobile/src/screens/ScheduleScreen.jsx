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

export default function ScheduleScreen({ navigation }) {

  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200",
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
              מגרש כדורגל • מרחבים 1120, דימונה
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