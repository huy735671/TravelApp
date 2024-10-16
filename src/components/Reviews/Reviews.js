import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, LogBox } from 'react-native';
import Review from './Review';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Reviews = ({ tripId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('reviews')
      .where('tripId', '==', tripId)
      .onSnapshot(snapshot => {
        // Kiểm tra nếu snapshot không có bình luận
        if (snapshot.empty) {
          setReviews([]);
        } else {
          const fetchedReviews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReviews(fetchedReviews);
        }
        setLoading(false);
      }, error => {
        // Bỏ qua lỗi không liên quan đến fetch
        if (error.code !== 'not-found') {
          console.error('Error fetching reviews:', error); // Chỉ ghi log lỗi thực sự
        }
        setLoading(false);
      });
  
    return () => unsubscribe();
  }, [tripId]);
  

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  LogBox.ignoreLogs(['No reviews found for this trip']);

  return (
    <View style={styles.container}>
      {reviews.length > 0 ? (
        reviews.slice(0, 3).map(review => <Review review={review} key={review.id} />)
      ) : (
        <Text style={styles.noReviewsText}>Không có bình luận cho địa điểm này.</Text>
      )}
      {reviews.length > 3 && (
        <TouchableOpacity onPress={() => navigation.navigate('AllReviews', { tripId })}>
          <Text style={styles.seeAllText}>Xem tất cả</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  noReviewsText: {
    color: '#808080', // Màu chữ cho thông báo không có bình luận
    textAlign: 'center',
    marginTop: 10,
  },
  seeAllText: {
    color: '#007BFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Reviews;
