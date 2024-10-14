import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Rating} from 'react-native-ratings';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Import Firebase auth
import {colors, shadow, sizes, spacing} from '../../../constants/theme';
import * as Animatable from 'react-native-animatable';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from '../../shared/Icon';

const ReviewSection = () => {
  const route = useRoute();
  const {hotelId} = route.params;
  const [hotelInfo, setHotelInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [rating, setRating] = useState(0);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchReviewsAndHotelInfo = async () => {
      try {
        if (!hotelId) {
          console.error('Invalid hotelId:', hotelId);
          return;
        }

        // Lấy thông tin khách sạn
        const hotelSnapshot = await firestore()
          .collection('hotels')
          .doc(hotelId)
          .get();

        if (hotelSnapshot.exists) {
          setHotelInfo(hotelSnapshot.data());
        } else {
          console.error('Hotel not found');
        }

        // Lấy các đánh giá
        const reviewsSnapshot = await firestore()
          .collection('reviewHotels')
          .where('hotelId', '==', hotelId)
          .get();

        const reviewsData = reviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews and hotel info:', error);
      }
    };

    fetchReviewsAndHotelInfo();
  }, [hotelId]);

  const handleAddReview = async () => {
    if (newReview.trim() && newTitle.trim() && rating > 0) {
      try {
        // Lấy thông tin người dùng dựa trên email
        const userSnapshot = await firestore()
          .collection('users')
          .where('email', '==', 'huynew@gmail.com') // Thay thế bằng email hiện tại của người dùng
          .limit(1)
          .get();
  
        if (userSnapshot.empty) {
          Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
          return;
        }
  
        const userData = userSnapshot.docs[0].data();
  
        // Lưu đánh giá vào Firestore
        await firestore().collection('reviewHotels').add({
          title: newTitle,
          reviewDescription: newReview,
          hotelId: hotelId,
          rating: rating,
          authorEmail: userData.email, // Lưu email của tác giả
          authorUsername: userData.username, // Lưu username của tác giả
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
  
        // Xóa nội dung nhập
        setNewReview('');
        setNewTitle('');
        setRating(0);
        Alert.alert('Thành công', 'Đánh giá của bạn đã được thêm.');
      } catch (error) {
        console.error('Error adding review:', error);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi thêm đánh giá.');
      }
    } else {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin.');
    }
  };
  

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="#4c8d6e"
      />
      <Animatable.View
        style={[styles.backButton, {marginTop: insets.top}]}
        animation="fadeIn"
        delay={500}
        duration={400}
        easing="ease-in-out">
        <Icon icon="Back" style={styles.backIcon} onPress={navigation.goBack} />
      </Animatable.View>
      <View style={{flex:1, padding:10,}}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Đánh Giá Khách Sạn</Text>
        </View>
        {hotelInfo && (
          <View style={styles.hotelInfo}>
            <Text style={styles.hotelName}>{hotelInfo.title}</Text>
            <Text>{hotelInfo.address}</Text>
          </View>
        )}
        <Text style={styles.title}>Đánh giá của bạn</Text>
        <Rating
          type="star"
          imageSize={30}
          startingValue={rating}
          onFinishRating={setRating}
          style={styles.rating}
        />
        <TextInput
          style={styles.titleInput}
          placeholder="Tiêu đề đánh giá"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput
          style={styles.descriptionInput}
          placeholder="Nội dung đánh giá"
          value={newReview}
          onChangeText={setNewReview}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleAddReview}>
          <Text style={styles.submitButtonText}>Gửi Đánh Giá</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  backButton: {
    backgroundColor: '#4c8d6e',
  },
  header: {
    paddingVertical: spacing.m,
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.primary,
    fontSize: sizes.title,
    fontWeight: 'bold',
  },
  hotelInfo: {
    borderWidth:1,
    borderColor:'#ddd',
    padding:10,
    borderRadius:10,
    marginVertical: spacing.m,
  },
  hotelName: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color:colors.primary,
  },
  title: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    marginVertical: spacing.s,
  },
  rating: {
    marginVertical: spacing.m,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: sizes.radius,
    padding: spacing.s,
    fontSize: sizes.body,
    backgroundColor: colors.white,
    marginBottom: spacing.m,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: sizes.radius,
    padding: spacing.s,
    fontSize: sizes.body,
    height: 100,
    backgroundColor: colors.white,
    marginBottom: spacing.m,
  },
  submitButton: {
    backgroundColor: '#4c8d6e',
    paddingVertical: spacing.m,
    borderRadius: sizes.radius,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: sizes.body,
    fontWeight: 'bold',
  },
  reviewsContainer: {
    marginTop: spacing.m,
  },
  reviewsHeader: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    marginBottom: spacing.s,
  },
  reviewItem: {
    marginBottom: spacing.s,
    padding: spacing.s,
    backgroundColor: colors.white,
    borderRadius: sizes.radius,
    ...shadow.light,
  },
  reviewTitle: {
    fontWeight: 'bold',
  },
  reviewRating: {
    marginTop: 5,
    color: colors.gray,
  },
  reviewAuthor: {
    marginTop: 5,
    color: colors.gray,
    fontStyle: 'italic',
  },
});

export default ReviewSection;
