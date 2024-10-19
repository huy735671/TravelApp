import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icon cho số sao
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import icon cho location và lịch
import { colors, sizes } from '../../../constants/theme';
import { useNavigation } from '@react-navigation/native';

const SpecialOfferDetails = () => {
  const [discountedHotels, setDiscountedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchDiscountedHotels = async () => {
      setLoading(true);
      try {
        const discountQuery = firestore().collection('hotelDiscount');
        const discountSnapshot = await discountQuery.get();

        const hotels = await Promise.all(discountSnapshot.docs.map(async (doc) => {
          const discountData = doc.data();
          
          const hotelDoc = await firestore().collection('hotels').doc(discountData.hotelId).get();
          const hotelData = hotelDoc.data();
          
          const discountedPrice = discountData.originalPrice - (discountData.originalPrice * (discountData.discountPercentage / 100));

          return {
            id: doc.id,
            ...discountData,
            hotelName: hotelData.title,
            hotelImage: hotelData.imageUrl,
            originalPrice: discountData.originalPrice,
            discountedPrice,
            starRating: hotelData.starRating,
            location: hotelData.location,
            endDate: discountData.endDate, 
          };
        }));

        setDiscountedHotels(hotels.filter(Boolean));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Có lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedHotels();
  }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const renderHotelItem = ({ item }) => {
    const formattedEndDate = new Date(item.endDate).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  
    return (
      <View style={styles.hotelItem}>
       
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.hotelImage }} style={styles.hotelImage} />
          <View style={styles.discountTag}>
            <Text style={styles.discountText}>-{item.discountPercentage}%</Text>
          </View>
        </View>
  
       
        <View style={styles.detailsContainer}>
          <Text style={styles.hotelName}>{item.hotelName}</Text>
  
         
          <View style={styles.infoRow}>
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={16} color="gray" />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
            <Text style={styles.starRating}>
              <Icon name="star" size={16} color="gold" /> {item.starRating}
            </Text>
          </View>
  
         
          <View style={styles.priceRow}>
            <Text style={styles.discountedPrice}>{formatPrice(item.discountedPrice)}đ</Text>
            <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}đ</Text>
          </View>
  
         
          <View style={styles.endDateRow}>
            <MaterialIcons name="event" size={16} color="gray" />
            <Text style={styles.endDate}>Khuyến mãi đến: {formattedEndDate}</Text>
          </View>
        </View>
  
       
        <TouchableOpacity style={styles.bookingButton} onPress={() => handleBooking(item.hotelId)}>
          <Text style={styles.bookingText}>Đặt phòng</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleBooking = (hotelId) => {
    navigation.navigate('HotelDetails', { hotelId });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Đang tải...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <FlatList
          data={discountedHotels}
          renderItem={renderHotelItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  hotelItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  hotelImage: {
    width: '100%',
    height: 200,
  },
  discountTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 10,
  },
  hotelName: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.primary,
  },
  infoRow: {
    marginBottom: 8,
  },
  starRating: {
    marginTop:8,
    fontSize: 14,
    color: 'gold',
    marginLeft: 1, // Thêm một chút khoảng cách giữa địa điểm và số sao
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 5,
  },
  
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  discountedPrice: {
    fontSize: sizes.h2,
    color: '#2563eb',
    fontWeight: 'bold',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: sizes.h3,
    color: colors.gray,
    textDecorationLine: 'line-through',
  },
  endDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  endDate: {
    marginLeft: 5,
    fontSize: 14,
    color: 'gray',
  },
  bookingButton: {
    backgroundColor: '#2563eb',
    padding: 8,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookingText: {
    color: '#fff',
    fontSize: sizes.h3,
    fontWeight: 'bold',
  },
});

export default SpecialOfferDetails;
