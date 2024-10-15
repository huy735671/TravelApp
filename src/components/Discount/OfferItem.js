import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const OfferItem = ({ offer }) => {
  const [hotelName, setHotelName] = useState('');
  const navigation = useNavigation(); // Khởi tạo navigation

  // Hàm chuyển đổi timestamp thành định dạng chuỗi
  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp._seconds) {
      const date = new Date(timestamp._seconds * 1000); // Chuyển đổi giây thành milliseconds
      return date.toLocaleDateString('vi-VN'); // Định dạng ngày theo kiểu Việt Nam
    }
    return ''; // Nếu không có timestamp hợp lệ, trả về chuỗi rỗng
  };

  // Lấy tên khách sạn từ Firestore
  useEffect(() => {
    const fetchHotelName = async () => {
      try {
        const hotelDoc = await firestore()
          .collection('hotels')
          .doc(offer.hotelId) // Sử dụng hotelId từ offer
          .get();

        if (hotelDoc.exists) {
          setHotelName(hotelDoc.data().title); 
        }
      } catch (error) {
        console.error("Error fetching hotel name: ", error);
      }
    };

    fetchHotelName();
  }, [offer.hotelId]);

  const formatCurrency = (amount) => {
    if (amount !== undefined && amount !== null) {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Thay thế mỗi nhóm ba chữ số bằng dấu chấm
    }
    return '0'; // Trả về '0' nếu không có giá trị
  };

  // Xử lý khi nhấn vào nút 'Dùng ngay'
  const handlePress = () => {
    navigation.navigate('HotelDetails', { hotelId: offer.hotelId }); // Điều hướng sang HotelDetails và truyền hotelId
  };

  return (
    <View style={styles.offerContainer}>
      <View style={styles.offerDetails}>
        <Text style={styles.offerTitle}>Áp dụng cho khách sạn {hotelName || "Đang tải..."}</Text>
        <Text style={styles.offerExpiryDate}>
          Hạn sử dụng: {formatTimestamp(offer.expirationDate)}
        </Text>
        <Text style={styles.offerMinAmount}>
          Hóa đơn tối thiểu: {formatCurrency(offer.minAmount)} VND
        </Text>
        <Text style={styles.offerMaxUsage}>
          Giảm giá: {offer.discount}%
        </Text>
        <TouchableOpacity style={styles.detailsButton} onPress={handlePress}>
          <Text style={styles.detailsButtonText}>Dùng ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  offerContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 10,
    padding: 10, // Thêm padding cho container
  },
  offerDetails: {
    justifyContent: 'center',
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  offerDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  offerExpiryDate: {
    fontSize: 12,
    color: '#999',
  },
  offerMinAmount: {
    fontSize: 12,
    color: '#999',
  },
  offerMaxUsage: {
    fontSize: 12,
    color: '#999',
  },
  detailsButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  detailsButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default OfferItem;
