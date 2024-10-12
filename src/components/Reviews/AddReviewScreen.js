import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Alert,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {colors, shadow, sizes, spacing} from '../../constants/theme';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Rating} from 'react-native-ratings';
import * as Animatable from 'react-native-animatable';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from '../shared/Icon';

const AddReviewScreen = ({route}) => {
  const {tripId} = route.params;
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [reviewDescription, setReviewDescription] = useState('');
  const [userData, setUserData] = useState(null);
  const [tripInfo, setTripInfo] = useState({title: '', location: ''});
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userSnapshot = await firestore()
            .collection('users')
            .doc(currentUser.email)
            .get();

          if (userSnapshot.exists) {
            setUserData(userSnapshot.data());
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

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
        console.error('Lỗi khi lấy thông tin chuyến đi:', error);
      }
    };

    fetchUserData();
    fetchTripInfo();
  }, [tripId]);

  const handleAddReview = async () => {
    if (!userData || !reviewDescription || !title || rating <= 0) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      await firestore()
        .collection('reviews')
        .add({
          tripId: tripId,
          author: {
            username: userData.username,
            email: userData.email,
          },
          rating,
          title,
          reviewDescription,
          date: today,
        });
      Alert.alert('Thành công', 'Đánh giá của bạn đã được thêm.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi thêm đánh giá.');
    }
  };

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
      <View style={styles.bodyContainer}>
        <View style={{alignItems:'center'}}>
        <Text style={styles.title}>Viết Đánh Giá</Text>
        </View>
        <View style={styles.titleLocation}>
        {tripInfo.title && tripInfo.location && (
          <View style={styles.tripInfoContainer}>
            <Text style={styles.tripInfo}>{tripInfo.title}</Text>
            <Text style={styles.tripInfolocation}>{tripInfo.location}</Text>
          </View>
        )}
        </View>
       
        <Text style={styles.titleDescription}>Đánh giá của bạn</Text>
        <Rating
          type="star"
          imageSize={35}
          startingValue={rating}
          onFinishRating={setRating}
          style={styles.rating}
        />
        <Text style={styles.titleDescription}>Tiêu đề bình luận</Text>
        <TextInput
          style={styles.titleInput} // Sử dụng style mới cho ô tiêu đề
          placeholder="Nhập tiêu đề ngắn gọn"
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.titleDescription}>Nội dung bình luận</Text>
        <TextInput
          style={styles.descriptionInput} // Sử dụng style mới cho ô mô tả
          placeholder="Chia sẻ trải nghiệm của bạn..."
          value={reviewDescription}
          onChangeText={setReviewDescription}
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
  titleLocation:{
    borderWidth:2,
    borderRadius:sizes.radius,
    borderColor:'#ddd',
    
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.s,
    backgroundColor: '#4c8d6e',

  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.m,
  },
  backIcon: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: sizes.radius,
    ...shadow.light,
  },
  bodyContainer: {
    padding: 10,
  },
  title: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    marginBottom: spacing.m,
    color:colors.primary,
  },
  tripInfoContainer: {
    marginHorizontal:10,
    justifyContent:'center',
    paddingVertical:20,
  
  },
  tripInfo: {
    fontSize: sizes.h2,
    color: colors.primary,
    marginBottom: spacing.s,
    fontWeight:'bold',
    
  },
  tripInfolocation:{
    fontSize: sizes.h3,
  },
  userInfoContainer: {
    marginBottom: spacing.l,
    alignItems: 'center',
  },
  userInfo: {
    fontSize: sizes.body,
    color: colors.primary,
    marginBottom: spacing.s,
  },
  rating: {
    marginVertical: spacing.m,
  },
  titleDescription: {
    paddingHorizontal: 10,
    fontWeight: 'bold',
    fontSize: sizes.h3,
    color: colors.primary,
    marginBottom: 10,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: sizes.radius,
    padding: spacing.s,
    fontSize: sizes.body +3,
    backgroundColor: colors.white,
    marginBottom: spacing.m,
    height: 60,
    ...shadow.light,
    padding: 10,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: sizes.radius,
    fontSize: sizes.body +3,
    height: 190,
    backgroundColor: colors.white,
    marginBottom: spacing.m,
    ...shadow.light,
    padding: 10,
  },
  submitButton: {
    backgroundColor: '#4c8d6e',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: sizes.radius,
    alignItems: 'center',
    ...shadow.light,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: sizes.body,
    fontWeight: 'bold',
  },
});

export default AddReviewScreen;
