// MostBookedHotels.js
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {colors, sizes} from '../../constants/theme';

const MostBookedHotels = ({navigation}) => {
  const [mostBookedHotels, setMostBookedHotels] = useState([]);

  const fetchMostBookedHotels = async () => {
    try {
      const bookingsSnapshot = await firestore().collection('bookings').get();
      const bookingCounts = {};

      bookingsSnapshot.forEach(doc => {
        const {hotelId} = doc.data();
        bookingCounts[hotelId] = (bookingCounts[hotelId] || 0) + 1;
      });

      // Sắp xếp theo số lần đặt và lấy 5 khách sạn nhiều nhất
      const sortedHotelIds = Object.entries(bookingCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const hotelPromises = sortedHotelIds.map(async ([hotelId]) => {
        const hotelDoc = await firestore()
          .collection('hotels')
          .doc(hotelId)
          .get();
        return {id: hotelId, ...hotelDoc.data()};
      });

      const hotels = await Promise.all(hotelPromises);
      setMostBookedHotels(hotels);
    } catch (error) {
      console.error('Error fetching most booked hotels:', error);
    }
  };

  useEffect(() => {
    fetchMostBookedHotels();
  }, []);

  const renderHotel = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('HotelDetails', {hotelId: item.id})}>
      <Image source={{uri: item.imageUrl}} style={styles.cardImage} />
      <View style={styles.cardDetails}>
        <Text style={styles.hotelName}>{item.title}</Text>
        <Text style={styles.hotelLocation}>{item.location}</Text>
        <Text style={styles.priceText}>
          {new Intl.NumberFormat('vi-VN').format(item.pricePerNight)} Vnd/đêm
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={mostBookedHotels}
        keyExtractor={item => item.id}
        renderItem={renderHotel}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    width: 200,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  cardImage: {
    height: 120,
    width: '100%',
  },
  cardDetails: {
    padding: 10,
  },
  hotelName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  hotelLocation: {
    color: colors.grey,
    fontSize: 14,
  },
  priceText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MostBookedHotels;
