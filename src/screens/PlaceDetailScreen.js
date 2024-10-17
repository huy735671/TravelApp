import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import WeatherInfo from '../components/TripDetails/TripDetalsCard/WeatherInfo';
import {colors, sizes, spacing} from '../constants/theme';
import StarRating from '../components/shared/Rating/Rating';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const PlaceDetailScreen = ({route}) => {
  const {trip} = route.params;
  const [starRating, setStarRating] = useState(0);
  const [topPlaces, setTopPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State cho hình ảnh đang được phóng to

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

  const handleRating = async rating => {
    setStarRating(rating);
    try {
      await firestore()
        .collection('places')
        .doc(trip.id)
        .update({starRating: rating});
      console.log('Star rating updated!');
    } catch (error) {
      console.error('Error updating star rating:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật đánh giá.');
    }
  };

  // Hàm để mở modal phóng to hình ảnh
  const openImageModal = image => {
    setSelectedImage(image);
  };

  // Hàm để đóng modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const getActivityIcon = activity => {
    switch (activity) {
      case 'Chụp hình':
        return 'camera'; // Icon camera từ FontAwesome
      case 'Tắm biển':
        return 'sun-o'; // Icon sóng biển
      case 'Thăm quan':
        return 'map-marker'; // Icon bản đồ
      case 'Ăn uống':
        return 'cutlery'; // Icon ăn uống
      default:
        return 'circle'; // Icon mặc định
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{uri: trip.imageUrl}} style={styles.image} />
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
            <Text
              style={{
                fontSize: sizes.h3,
                color: colors.primary,
                fontWeight: 'bold',
              }}>
              Giới thiệu về {trip.title}
            </Text>

            <View style={{flexDirection: 'row'}}>
              <StarRating
                disabled={true}
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
          </View>
        )}
        <View
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            borderColor: '#ddd',
            marginVertical: 10,
          }}>
          <Text style={styles.description}>{trip.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
          <Text style={styles.sectionbodyText}>Địa điểm: {trip.address}</Text>
          <Text style={styles.sectionbodyText}>
            Thời gian mở cửa: {trip.openingHours}
          </Text>
          <Text style={styles.sectionbodyText}>
            Sân bay gần nhất: {trip.nearestAirport}
          </Text>
          <Text style={styles.sectionbodyText}>
            Phương tiện công cộng: {trip.publicTransport}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoạt động</Text>
          {Array.isArray(trip.activities) && trip.activities.length > 0 ? (
            trip.activities.map((activity, index) => (
              <View key={index} style={styles.activityItemContainer}>
                <Icon
                  name={getActivityIcon(activity)}
                  size={30}
                  color={colors.primary}
                  style={styles.activityIcon}
                />
                <Text style={styles.activityItem}>{activity}</Text>
              </View>
            ))
          ) : (
            <Text>Không có hoạt động nào</Text>
          )}
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thời tiết</Text>
          <WeatherInfo location={trip.location} />
        </View> */}

        <Text style={styles.galleryTitle}>Ảnh liên quan đến địa điểm</Text>
        <View style={styles.gallery}>
          {Array.isArray(trip.gallery) && trip.gallery.length > 0 ? (
            trip.gallery.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => openImageModal(image)}>
                <Image source={{uri: image}} style={styles.galleryImage} />
              </TouchableOpacity>
            ))
          ) : (
            <Text>Không có ảnh nào</Text>
          )}
        </View>
      </View>

      {/* Modal để hiển thị hình ảnh phóng to */}
      {selectedImage && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={closeImageModal}>
          <TouchableOpacity
            style={styles.modalContainer}
            onPress={closeImageModal}>
            <Image source={{uri: selectedImage}} style={styles.modalImage} />
          </TouchableOpacity>
        </Modal>
      )}
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
    color: colors.primary,
    marginBottom: spacing.m,
    lineHeight: 20,
  },
  starRatingContainer: {
    flexDirection: 'column',
    padding: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  starRating: {
    marginRight: spacing.s,
  },
  ratingValue: {
    fontSize: sizes.body,
    color: colors.darkGray,
  },
  section: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    borderColor: '#ddd',
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.s,
  },
  sectionbodyText: {
    fontSize: sizes.body,
    color: colors.primary,
    padding: 3,
  },
  activityItem: {
    fontSize: sizes.body,
    color: colors.darkGray,
  },
  galleryTitle: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    marginVertical: spacing.m,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  galleryImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 10,
  },

  activityItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.lightGray, // Màu nền
    borderRadius: 10, // Bo góc
    shadowColor: '#000', // Hiệu ứng đổ bóng
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2, // Hiệu ứng đổ bóng cho Android
  },
  activityIcon: {
    marginRight: 10,
    fontSize: 28,
  },
  activityItem: {
    fontSize: sizes.body,
    color: colors.primary, // Thay đổi màu chữ
    fontWeight: 'bold', // Chữ đậm hơn
    flex: 1,
  },
});

export default PlaceDetailScreen;
