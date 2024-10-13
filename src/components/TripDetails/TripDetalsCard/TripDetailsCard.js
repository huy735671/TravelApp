// Import thêm useEffect từ react
import React, { useRef, useState, useEffect} from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, Animated, TouchableOpacity } from 'react-native';
import HotelsCarousel from './HotelsCarousel';
import Divider from '../../shared/Divider';
import SectionHeader from '../../shared/SectionHeader';
import RatingOverall from '../../shared/Rating/RatingOverall'; // Import component RatingOverall
import Reviews from '../../Reviews/Reviews';
import { colors, sizes, spacing } from '../../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import RelatedLocations from './RelatedLocations';
import firestore from '@react-native-firebase/firestore'; // Import Firestore

const TripDetailsCard = ({ trip }) => {
  const navigation = useNavigation();
  
  const [expanded, setExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(480)).current;
  
  const [averageRating, setAverageRating] = useState(0); // State để lưu rating trung bình
  const [loading, setLoading] = useState(true);

  // Hàm để chuyển đổi giữa chiều cao
  const toggleExpand = () => {
    Animated.timing(heightAnim, {
      toValue: expanded ? 480 : 700,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  // Lấy dữ liệu đánh giá từ Firestore và tính trung bình rating
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const snapshot = await firestore()
          .collection('reviews')
          .where('tripId', '==', trip.id) // Lấy các đánh giá theo tripId
          .get();

        if (!snapshot.empty) {
          let totalRating = 0;
          snapshot.forEach(doc => {
            const data = doc.data();
            totalRating += data.rating; // Cộng dồn rating từ các đánh giá
          });

          const avgRating = totalRating / snapshot.size; // Tính rating trung bình
          setAverageRating(avgRating); // Cập nhật state
          
          // Cập nhật starRating trong trip
          await firestore().collection('places').doc(trip.id).update({
            starRating: avgRating, // Cập nhật starRating
          });
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchRatings();
  }, [trip.id]);

  return (
    <Animated.View style={[styles.container, { height: heightAnim }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{trip.title}</Text>
        <View style={styles.location}>
          <Text style={styles.locationText}>{trip.location}</Text>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleExpand}>
            <Text style={styles.toggleButtonText}>{expanded ? 'Thu gọn' : 'Mở rộng'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Divider style={styles.divider} />

      <ScrollView style={styles.scrollBox} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <RatingOverall rating={averageRating} containerStyle={styles.rating} /> // Hiển thị rating trung bình
        )}

        <SectionHeader
          title="Giới thiệu"
          containerStyle={styles.SectionHeader}
          titleStyle={styles.sectionTitle}
          onPress={() => {}}
          buttonTitle="Tất cả"
        />
        <View style={styles.summary}>
          <Text style={styles.summaryText}>{trip.description}</Text>
        </View>
        
        <SectionHeader
          title="Khách sạn liên quan"
          containerStyle={styles.SectionHeader}
          titleStyle={styles.sectionTitle}
          onPress={() => navigation.navigate('AllHotels')}
          buttonTitle="Tất cả"
        />
        <HotelsCarousel hotels={trip.hotels || []} location={trip.location} />

        <SectionHeader
          title="Đánh giá"
          containerStyle={styles.sectionHeader}
          titleStyle={styles.sectionTitle}
          onPress={() => {}}
          buttonTitle="Tất cả"
        />
        <Reviews tripId={trip.id} />

        <TouchableOpacity
          style={styles.addReviewButton}
          onPress={() => navigation.navigate('AddReview', { tripId: trip.id })}
        >
          <Text style={styles.addReviewButtonText}>Viết Đánh Giá</Text>
        </TouchableOpacity>

        <SectionHeader
          title="Địa điểm liên quan"
          containerStyle={styles.sectionHeader}
          titleStyle={styles.sectionTitle}
          onPress={() => {}}
          buttonTitle="Tất cả"
        />
        <RelatedLocations location={trip.location} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    top: -20,
  },
  header: {
    paddingVertical: spacing.l - 30,
    paddingHorizontal: spacing.l,
  },
  title: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: colors.primary,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationText: {
    fontSize: sizes.title,
    color: colors.primary,
  },
  divider: {
    marginVertical: spacing.m,
  },
  scrollBox: {
    marginTop: spacing.s,
    marginBottom: spacing.m,
  },
  SectionHeader: {
    marginTop: spacing.m,
  },
  sectionTitle: {
    color: colors.lightGray,
    fontWeight: 'normal',
  },
  summary: {
    marginHorizontal: spacing.l,
  },
  summaryText: {
    color: colors.primary,
  },
  rating: {
    marginHorizontal: spacing.l,
  },
  sectionHeader: {
    marginTop: spacing.m,
  },
  toggleButton: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  toggleButtonText: {
    color: colors.light,
    fontWeight: 'bold',
  },
  addReviewButton: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    backgroundColor: colors.green,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: spacing.m,
    marginHorizontal: 20,
  },
  addReviewButtonText: {
    color: colors.light,
    fontWeight: 'bold',
  },
});

export default TripDetailsCard;
