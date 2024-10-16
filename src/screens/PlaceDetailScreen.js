import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import WeatherInfo from '../components/TripDetails/TripDetalsCard/WeatherInfo';
import { colors, sizes, spacing } from '../constants/theme';
import StarRating from '../components/shared/Rating/Rating';
import firestore from '@react-native-firebase/firestore';

const PlaceDetailScreen = ({ route }) => {
  const { trip } = route.params;
  const [starRating, setStarRating] = useState(0);
  const [topPlaces, setTopPlaces] = useState([]); // State để lưu danh sách topPlaces
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tripDoc, topPlacesSnapshot] = await Promise.all([
          firestore().collection('places').doc(trip.id).get(),
          firestore().collection('topPlaces').get(),
        ]);

        // Lấy đánh giá từ places
        if (tripDoc.exists) {
          const rating = tripDoc.data().starRating;
          setStarRating(typeof rating === 'number' ? rating : 0);
        }

        // Lấy danh sách từ topPlaces
        const topPlacesData = topPlacesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTopPlaces(topPlacesData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể lấy dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trip.id]);

  const handleRating = async (rating) => {
    setStarRating(rating);
    try {
      await firestore()
        .collection('places')
        .doc(trip.id)
        .update({ starRating: rating });
      console.log('Star rating updated!');
    } catch (error) {
      console.error('Error updating star rating:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật đánh giá.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: trip.imageUrl }} style={styles.image} />
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>{trip.title}</Text>
          <Text style={styles.overlayLocation}>
            {trip.location}, {trip.country}
          </Text>
        </View>
      </View>

      <View style={styles.bodyContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.starRatingContainer}>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={starRating}
              starSize={20}
              fullStarColor={colors.primary}
              containerStyle={styles.starRating}
              selectedStar={handleRating}
            />
            <Text style={styles.ratingValue}>
              {starRating ? starRating.toFixed(1) : 'N/A'}
            </Text>
          </View>
        )}

        <Text style={styles.description}>{trip.description}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
          <Text>Địa điểm: {trip.location}</Text>
          <Text>Quốc gia: {trip.country}</Text>
          <Text>Sân bay gần nhất: {trip.nearestAirport}</Text>
          <Text>Phương tiện công cộng: {trip.publicTransport}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thời tiết</Text>
          <WeatherInfo location={trip.location} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoạt động</Text>
          {Array.isArray(trip.activities) && trip.activities.length > 0 ? (
            trip.activities.map((activity, index) => (
              <Text key={index} style={styles.activityItem}>
                - {activity}
              </Text>
            ))
          ) : (
            <Text>Không có hoạt động nào</Text>
          )}
        </View>

        <Text style={styles.galleryTitle}>Ảnh liên quan đến địa điểm</Text>
        <View style={styles.gallery}>
          {Array.isArray(trip.gallery) && trip.gallery.length > 0 ? (
            trip.gallery.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.galleryImage}
              />
            ))
          ) : (
            <Text>Không có ảnh nào</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Các địa điểm hàng đầu</Text>
          {topPlaces.length > 0 ? (
            topPlaces.map((place) => (
              <Text key={place.id} style={styles.activityItem}>
                - {place.name}
              </Text>
            ))
          ) : (
            <Text>Không có địa điểm nào</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  overlayTitle: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: colors.light,
  },
  overlayLocation: {
    fontSize: sizes.body,
    color: colors.light,
  },
  bodyContainer: {
    padding: 10,
  },
  description: {
    fontSize: sizes.body,
    color: colors.darkGray,
    marginBottom: spacing.m,
  },
  starRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  starRating: {
    marginRight: spacing.s,
  },
  ratingValue: {
    fontSize: sizes.body,
    color: colors.darkGray,
  },
  sectionTitle: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.s,
  },
  activityItem: {
    fontSize: sizes.body,
    color: colors.darkGray,
  },
  galleryTitle: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.s,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryImage: {
    width: '48%',
    height: 150,
    borderRadius: 10,
    marginBottom: spacing.m,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: spacing.m,
  },
});

export default PlaceDetailScreen;
