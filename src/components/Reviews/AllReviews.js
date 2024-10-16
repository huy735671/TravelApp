import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Review from './Review';
import firestore from '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import Icon from '../shared/Icon';
import {colors, shadow, sizes, spacing} from '../../constants/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const AllReviews = ({route}) => {
  const navigation = useNavigation();
  const {tripId} = route.params;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tripInfo, setTripInfo] = useState({title: '', location: ''}); // State for trip info
  const [sortCriteria, setSortCriteria] = useState('newest'); // State for sort criteria

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const unsubscribeReviews = firestore()
      .collection('reviews')
      .where('tripId', '==', tripId)
      .onSnapshot(
        snapshot => {
          if (snapshot.empty) {
            console.log('No reviews found');
            setReviews([]);
          } else {
            const fetchedReviews = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setReviews(fetchedReviews);
          }
          setLoading(false);
        },
        error => {
          console.error('Error fetching reviews:', error);
          setLoading(false);
        },
      );

    // Fetch trip info
    const fetchTripInfo = async () => {
      try {
        const tripSnapshot = await firestore()
          .collection('places')
          .doc(tripId)
          .get();

        if (tripSnapshot.exists) {
          const {title, location} = tripSnapshot.data();
          setTripInfo({title, location});
        }
      } catch (error) {
        console.error('Error fetching trip info:', error);
      }
    };

    fetchTripInfo(); // Call fetch function
    return () => unsubscribeReviews();
  }, [tripId]);

  // Tính trung bình số sao và tổng số bình luận
  const calculateAverageRating = () => {
    if (reviews.length === 0) return {averageRating: 0, totalReviews: 0};

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0); 
    const averageRating = (totalRating / reviews.length).toFixed(1); // Lấy 1 chữ số thập phân
    return {averageRating, totalReviews: reviews.length};
  };

  const {averageRating, totalReviews} = calculateAverageRating();

  // Hàm để sắp xếp đánh giá
  const sortReviews = criteria => {
    setSortCriteria(criteria);
    let sortedReviews = [...reviews];

    if (criteria === 'newest') {
      sortedReviews.sort((a, b) => b.createdAt - a.createdAt); // Giả sử có trường createdAt
    } else if (criteria === 'highest') {
      sortedReviews.sort((a, b) => b.rating - a.rating);
    } else if (criteria === 'lowest') {
      sortedReviews.sort((a, b) => a.rating - b.rating);
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
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="#4c8d6e"
      />

      <View style={styles.header}>
        <Animatable.View
          style={[styles.backButton, {marginTop: insets.top}]}
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

      {/* Display trip information */}
      <View style={styles.tripInfoContainer}>
        <Text style={styles.tripTitle}>{tripInfo.title}</Text>
        <Text style={styles.tripLocation}>{tripInfo.location}</Text>
        <Text style={styles.ratingText}>
          ⭐ {averageRating} ({totalReviews} bình luận)
        </Text>
      </View>

      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => sortReviews('newest')}
          style={[
            styles.filterButton,
            sortCriteria === 'newest' && styles.activeFilter,
          ]}>
          <Text style={styles.filterText}>Mới nhất</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => sortReviews('highest')}
          style={[
            styles.filterButton,
            sortCriteria === 'highest' && styles.activeFilter,
          ]}>
          <Text style={styles.filterText}>Bình luận cao nhất</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => sortReviews('lowest')}
          style={[
            styles.filterButton,
            sortCriteria === 'lowest' && styles.activeFilter,
          ]}>
          <Text style={styles.filterText}>Bình luận thấp nhất</Text>
        </TouchableOpacity>
      </View>

      {/* <ScrollView contentContainerStyle={styles.scrollView}>
        {reviews.length > 0 ? (
          reviews.map(review => <Review review={review} key={review.id} />)
        ) : (
          <Text style={styles.noReviewsText}>
            Không có bình luận cho địa điểm này.
          </Text>
        )}
      </ScrollView> */}

<FlatList
  data={reviews}
  renderItem={({ item }) => <Review review={item} />}
  keyExtractor={(item) => item.id}
  contentContainerStyle={styles.scrollView}
  ListEmptyComponent={<Text style={styles.noReviewsText}>Không có bình luận cho địa điểm này.</Text>}
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
  header: {
    flexDirection: 'row',
    padding: spacing.s,
    backgroundColor: '#4c8d6e',
  },
  backButton: {
    backgroundColor: '#4c8d6e',
  },
  backIcon: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: sizes.radius,
    ...shadow.light,
  },
  tripInfoContainer: {
    padding: 10,
    backgroundColor: '#e7e7e8',
    margin: spacing.m,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    padding: spacing.m,
    backgroundColor: colors.light,
  },
  filterButton: {
    padding: spacing.s,
    backgroundColor: colors.white,
    borderRadius: sizes.radius,
    ...shadow.light,
  },
  activeFilter: {
    backgroundColor: colors.green,
  },
  filterText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  scrollView: {
    paddingBottom: sizes.padding,
  },
  noReviewsText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginTop: sizes.padding,
  },
});

export default AllReviews;
