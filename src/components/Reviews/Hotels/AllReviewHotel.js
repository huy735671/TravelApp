import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Divider from '../../shared/Divider';
import StarRating from '../../shared/Rating/Rating';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../shared/Icon';
import { colors } from 'react-native-elements';
import { sizes, spacing } from '../../../constants/theme';
import * as Animatable from 'react-native-animatable';

const AllReviewHotel = ({ route }) => {
  const navigation = useNavigation();
  const { hotelId } = route.params; // Nhận hotelId từ params
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hotelInfo, setHotelInfo] = useState({ title: '', location: '' });
  const [sortOrder, setSortOrder] = useState('newest'); // State để lưu trữ thứ tự sắp xếp

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchAllReviewsAndRatings = async () => {
      try {
        // Fetch all reviews from reviewHotels
        const reviewsSnapshot = await firestore()
          .collection('reviewHotels')
          .where('hotelId', '==', hotelId)
          .get();

        const reviewsData = reviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsData);

        // Tính toán rating trung bình
        const totalRating = reviewsData.reduce((acc, review) => acc + (review.rating || 0), 0);
        const average = reviewsData.length > 0 ? (totalRating / reviewsData.length).toFixed(1) : 0;
        setAverageRating(average);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchHotelInfo = async () => {
      try {
        const hotelSnapshot = await firestore()
          .collection('hotels')
          .doc(hotelId)
          .get();

        if (hotelSnapshot.exists) {
          const { title, location } = hotelSnapshot.data();
          setHotelInfo({ title, location });
        }
      } catch (error) {
        console.error('Error fetching hotel info:', error);
      }
    };

    fetchAllReviewsAndRatings();
    fetchHotelInfo();
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

  const sortReviews = (order) => {
    setSortOrder(order);
    let sortedReviews;
    if (order === 'newest') {
      sortedReviews = [...reviews].sort((a, b) => {
        return b.createdAt.seconds - a.createdAt.seconds; // Sắp xếp theo thời gian mới nhất
      });
    } else if (order === 'highest') {
      sortedReviews = [...reviews].sort((a, b) => b.rating - a.rating); // Sắp xếp theo rating cao nhất
    } else if (order === 'lowest') {
      sortedReviews = [...reviews].sort((a, b) => a.rating - b.rating); // Sắp xếp theo rating thấp nhất
    }
    setReviews(sortedReviews);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="#4c8d6e" />

      <View style={styles.header1}>
        <Animatable.View
          style={[styles.backButton, { marginTop: insets.top }]}
          animation="fadeIn"
          delay={500}
          duration={400}
          easing="ease-in-out">
          <Icon
            icon="Back"
            style={styles.backIcon}
            onPress={navigation.goBack}
          />
        </Animatable.View>
      </View>

      {/* Display hotel information */}
      <View style={styles.tripInfoContainer}>
        <Text style={styles.tripTitle}>{hotelInfo.title}</Text>
        <Text style={styles.tripLocation}>{hotelInfo.location}</Text>
        <Text style={styles.ratingText}>
          ⭐ {averageRating} (Tổng số {reviews.length} bình luận)
        </Text>
      </View>

      {/* Bộ lọc đánh giá */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Sắp xếp theo:</Text>
        <TouchableOpacity onPress={() => sortReviews('newest')}>
          <Text style={sortOrder === 'newest' ? styles.activeFilter : styles.filter}>Mới nhất</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => sortReviews('highest')}>
          <Text style={sortOrder === 'highest' ? styles.activeFilter : styles.filter}>Cao nhất</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => sortReviews('lowest')}>
          <Text style={sortOrder === 'lowest' ? styles.activeFilter : styles.filter}>Thấp nhất</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <>
            {renderReview(item)}
            <Divider enabledSpacing={false} />
          </>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.scrollView}
      />
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
  },
  header1: {
    backgroundColor: '#4c8d6e',
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: sizes.radius,
  },
  tripInfoContainer: {
    padding: 10,
    backgroundColor: '#e7e7e8',
    margin: spacing.m,
    borderRadius: 10,
  },
  tripTitle: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.primary,
  },
  tripLocation: {
    fontSize: sizes.body,
    color: colors.gray,
  },
  ratingText: {
    fontSize: sizes.body + 3,
    color: colors.primary,
    fontWeight: 'bold',
    marginTop: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    marginVertical: 10,
  },
  filterText: {
    fontSize: sizes.body,
    fontWeight: 'bold',
  },
  filter: {
    fontSize: sizes.body,
    color: colors.gray,
    marginHorizontal: 10,
  },
  activeFilter: {
    fontSize: sizes.body,
    color: colors.primary,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  reviewContainer: {
    marginVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: '#ddd',
  },
  scrollView: {
    paddingBottom: sizes.padding,
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
    fontSize: sizes.body - 2,
    color: colors.gray,
  },
  title: {
    fontSize: sizes.body + 2,
    fontWeight: 'bold',
  },
  description: {
    fontSize: sizes.body,
    color: colors.gray,
  },

});

export default AllReviewHotel;
