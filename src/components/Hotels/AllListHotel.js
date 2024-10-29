import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { colors, sizes } from '../../constants/theme';

const AllListHotel = ({ navigation }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch all hotels from Firestore
  const fetchHotels = async () => {
    try {
      const snapshot = await firestore().collection('hotels').get();
      const hotelsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHotels(hotelsList);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // Format price with dots every three digits
  const formatPrice = price => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const renderHotelItem = ({ item }) => (
    <TouchableOpacity
      style={styles.hotelContainer}
      onPress={() => navigation.navigate('HotelDetails', { hotelId: item.id })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.title}</Text>
        <Text style={styles.hotelLocation}>{item.location}</Text>
        <Text style={styles.hotelPrice}>{formatPrice(item.pricePerNight)} Vnd/đêm</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={item => item.id}
          renderItem={renderHotelItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
  },
  listContent: {
    paddingVertical: 10,
  },
  hotelContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 3,
  },
  hotelImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  hotelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  hotelName: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    color: colors.primary,
  },
  hotelLocation: {
    fontSize: sizes.body2,
    color: colors.grey,
    marginVertical: 2,
  },
  hotelPrice: {
    fontSize: sizes.body1,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default AllListHotel;
