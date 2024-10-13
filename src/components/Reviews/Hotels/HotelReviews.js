import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Divider from '../../shared/Divider';
import StarRating from '../../shared/Rating/Rating';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../constants/theme';

const HotelReviews = ({ hotelId }) => { // Remove navigation prop from here
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const navigation = useNavigation(); // Keep using useNavigation to get the navigation object

  useEffect(() => {
    const fetchReviewsAndRatings = async () => {
      try {
        // Fetch reviews from reviewHotels
        const reviewsSnapshot = await firestore()
          .collection('reviewHotels')
          .where('hotelId', '==', hotelId)
          .get();

        const reviewsData = reviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsData);

        // Fetch ratings from bookings
        const bookingsSnapshot = await firestore()
          .collection('bookings')
          .where('hotelId', '==', hotelId)
          .get();

        const bookingsData = bookingsSnapshot.docs.map(doc => doc.data());
        const bookingsRatings = bookingsData
          .map(booking => booking.rating)
          .filter(Boolean); // Lọc ra các rating hợp lệ

        // Fetch rating from hotels
        const hotelSnapshot = await firestore()
          .collection('hotels')
          .doc(hotelId)
          .get();

        const hotelData = hotelSnapshot.data();
        const hotelRating = hotelData ? hotelData.starRating : 0; // Lấy starRating từ hotel, nếu không có thì mặc định là 0

        // Tính toán rating trung bình
        const allRatings = [
          ...bookingsRatings,
          hotelRating,
          ...reviewsData.map(review => review.rating),
        ];
        const validRatings = allRatings.filter(rating => rating > 0); // Lọc ra các rating hợp lệ
        const total = validRatings.reduce((acc, rating) => acc + rating, 0);
        const average =
          validRatings.length > 0
            ? (total / validRatings.length).toFixed(1)
            : 0; // Tính trung bình và làm tròn

        setAverageRating(average);

        // Cập nhật starRating vào hotels
        await firestore()
          .collection('hotels')
          .doc(hotelId)
          .update({ starRating: parseFloat(average) });

      } catch (error) {
        console.error('Error fetching reviews or ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsAndRatings();
  }, [hotelId]);

  const renderReview = item => {
    const defaultAvatar =
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq9pLoSySk6m6k8jo6mrZgifjDTKRYa4xt3Q&s';

    const avatar = item.author?.avatar || defaultAvatar;
    const username = item.authorUsername || 'Unknown User';
    const date = item.createdAt
      ? new Date(item.createdAt.seconds * 1000).toLocaleString()
      : 'Unknown Date';
    const rating = item.rating || 0;

    return (
      <View key={item.id} style={styles.reviewContainer}>
        <View style={styles.header}>
          <Image style={styles.avatar} source={{ uri: avatar }} />
          <View style={styles.userBox}>
            <Text style={styles.user}>{username}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
          <StarRating rating={rating} disabled={true} size={15} showLabelTop />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.reviewDescription}</Text>
      </View>
    );
  };

  if (loading) {
    return <Text>Loading reviews...</Text>;
  }

  return (
    <View style={styles.reviewsList}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.averageRating}>{averageRating} </Text>

        <View style={{ flexDirection: 'column', paddingHorizontal: 10 }}>
          <Text style={{ textAlign: 'center' }}>Đánh giá chung</Text>
          <StarRating
            rating={parseFloat(averageRating)}
            disabled={true}
            size={15}
          />
        </View>
      </View>
      {reviews.slice(0, 3).map((review, index) => (
        <React.Fragment key={review.id}>
          {renderReview(review)}
          {index < 2 && <Divider enabledSpacing={false} />}
        </React.Fragment>
      ))}
      {reviews.length > 3 && (
        <TouchableOpacity
          style={styles.seeMoreButton}
          onPress={() => navigation.navigate('AllReviewHotel', { hotelId })}>
          <Text style={styles.seeMoreText}>Xem thêm bình luận</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  reviewsList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  averageRating: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewContainer: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    borderColor: '#ddd',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  avatar: {
    height: 30,
    width: 30,
    resizeMode: 'cover',
    borderRadius: 15,
    marginRight: 10,
  },
  userBox: {
    flex: 1,
  },
  user: {
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#555',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    marginTop: 5,
  },
  seeMoreButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 5,
    
  },
  seeMoreText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default HotelReviews;
