import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

const OfferItem = ({offer}) => {
  const [hotelName, setHotelName] = useState('');
  const navigation = useNavigation();

  const formatTimestamp = timestamp => {
    if (timestamp && timestamp._seconds) {
      const date = new Date(timestamp._seconds * 1000);
      return date.toLocaleDateString('vi-VN');
    }
    return '';
  };

  useEffect(() => {
    const fetchHotelName = async () => {
      try {
        const hotelDoc = await firestore()
          .collection('hotels')
          .doc(offer.hotelId)
          .get();

        if (hotelDoc.exists) {
          setHotelName(hotelDoc.data().title);
        }
      } catch (error) {
        console.error('Error fetching hotel name: ', error);
      }
    };

    fetchHotelName();
  }, [offer.hotelId]);

  const formatCurrency = amount => {
    if (amount !== undefined && amount !== null) {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return '0';
  };

  const handlePress = () => {
    navigation.navigate('HotelDetails', {hotelId: offer.hotelId});
  };

  return (
    <View style={styles.offerContainer}>
      <View style={styles.offerDetails}>
        <Text style={styles.offerTitle}>
          Áp dụng cho khách sạn: {hotelName || 'Đang tải...'}
        </Text>
        <Text style={styles.offerExpiryDate}>
          Hạn sử dụng: {formatTimestamp(offer.expirationDate)}
        </Text>
        <Text style={styles.offerMinAmount}>
          Hóa đơn tối thiểu: {formatCurrency(offer.minAmount)} VND
        </Text>
        <Text style={styles.offerMaxUsage}>Giảm giá: {offer.discount}%</Text>
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
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    elevation: 5,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    
  },
  offerDetails: {
    flex: 1,
    paddingRight: 10,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  offerExpiryDate: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  offerMinAmount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  offerMaxUsage: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  detailsButton: {
    padding: 10,
    backgroundColor: '#4c8d6e',
    borderRadius: 5,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OfferItem;
