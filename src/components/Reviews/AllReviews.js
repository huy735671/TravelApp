import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, StatusBar } from 'react-native';
import Review from './Review';
import firestore from '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import Icon from '../shared/Icon';
import { colors, shadow, sizes, spacing } from '../../constants/theme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const AllReviews = ({ route }) => {
  const navigation = useNavigation();
  const { tripId } = route.params;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tripName, setTripName] = useState('');
  
  const insets = useSafeAreaInsets();

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
        backgroundColor='#4c8d6e'
      />

      <View style={styles.header}>

      <Animatable.View
        style={[styles.backButton, {marginTop: insets.top}]}
        animation="fadeIn"
        delay={500}
        duration={400}
        easing="ease-in-out">
        <Icon icon="Back" style={styles.backIcon} onPress={navigation.goBack} />
      </Animatable.View>

      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {reviews.length > 0 ? (
          reviews.map(review => <Review review={review} key={review.id} />)
        ) : (
          <Text style={styles.noReviewsText}>Không có bình luận cho địa điểm này.</Text>
        )}
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
