import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text, Alert } from 'react-native';
import { colors, sizes, spacing } from '../../constants/theme';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AddReviewScreen = ({ route, navigation }) => {
  const { tripId } = route.params; // Nhận tripId từ params của route
  const [rating, setRating] = useState(0); // Giá trị rating (1-5)
  const [text, setText] = useState('');
  const [userData, setUserData] = useState(null); // Lưu thông tin người dùng

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userSnapshot = await firestore()
            .collection('users')
            .doc(currentUser.email) // Lấy thông tin dựa trên email của người dùng
            .get();

          if (userSnapshot.exists) {
            setUserData(userSnapshot.data()); // Lưu dữ liệu người dùng
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleAddReview = async () => {
    if (!userData || !text || rating <= 0) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      await firestore().collection('reviews').add({
        tripId: tripId, // ID của địa điểm
        author: {
          username: userData.username, // Lấy username từ dữ liệu người dùng
          email: userData.email, // Lấy email từ dữ liệu người dùng
        },
        rating,
        text,
        date: new Date().toISOString(),
      });
      Alert.alert('Thành công', 'Đánh giá của bạn đã được thêm.');
      navigation.goBack(); // Quay lại trang trước
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi thêm đánh giá.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Đánh Giá</Text>
      {userData && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfo}>Tên: {userData.username}</Text>
          <Text style={styles.userInfo}>Email: {userData.email}</Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="Xếp hạng (1-5)"
        value={String(rating)}
        keyboardType="numeric"
        onChangeText={text => setRating(Number(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Nội dung đánh giá"
        value={text}
        onChangeText={setText}
        multiline
      />
      <Button title="Gửi Đánh Giá" onPress={handleAddReview} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.l,
    backgroundColor: colors.light,
  },
  title: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    marginBottom: spacing.m,
  },
  userInfoContainer: {
    marginBottom: spacing.m,
  },
  userInfo: {
    fontSize: sizes.body,
    color: colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: sizes.radius,
    padding: spacing.s,
    marginBottom: spacing.s,
  },
});

export default AddReviewScreen;
