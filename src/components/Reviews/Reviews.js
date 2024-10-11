import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
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
      }, error => {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [tripId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {reviews.length > 0 ? (
        reviews.slice(0, 3).map(review => <Review review={review} key={review.id} />)
      ) : (
        <Text>Không có bình luận cho địa điểm này.</Text> // Đảm bảo chuỗi này nằm trong thành phần <Text>
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
  seeAllText: {
    color: '#007BFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Reviews;
