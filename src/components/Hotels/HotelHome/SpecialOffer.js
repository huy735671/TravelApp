import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../constants/theme';

const SpecialOffer = ({ navigation }) => {
  const handlePress = () => {
    // Điều hướng tới một trang rỗng
    navigation.navigate('SpecialOfferDetails'); // Bạn có thể thêm route này vào navigation stack
  };

  return (
    <View style={styles.offerContainer}>
      <Text style={styles.offerTitle}>Giảm giá mùa hè</Text>
      <Text style={styles.offerSubtitle}>Tiết kiệm đến 30% cho kỳ nghỉ của bạn</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Xem ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  offerContainer: {
    backgroundColor: colors.green,
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.light,
    marginBottom: 10,
  },
  offerSubtitle: {
    fontSize: 14,
    color: colors.light,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.light,
    paddingVertical: 6,  // Giảm chiều cao nút
    paddingHorizontal: 15,  // Giảm chiều rộng nút
    borderRadius: 5,
    alignSelf: 'flex-start',  // Căn nút về bên trái
  },
  buttonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default SpecialOffer;
