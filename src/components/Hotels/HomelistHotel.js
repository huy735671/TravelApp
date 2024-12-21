import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2; // trừ đi padding 16 mỗi bên

const HomelistHotel = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const snapshot = await firestore().collection('hotels').get();
        const hotelsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHotels(hotelsData);
      } catch (error) {
        console.error('Error fetching hotels: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải danh sách khách sạn...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {hotels.map((hotel, index) => (
          <TouchableOpacity
            key={hotel.id}
            style={styles.hotelItem}
            onPress={() => navigation.navigate('HotelDetails', { hotelId: hotel.id })}
          >
            <Image
              source={{ uri: hotel.imageUrl || 'https://via.placeholder.com/150' }}
              style={styles.hotelImage}
            />
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName} numberOfLines={1}>
                {hotel.title}
              </Text>
              <Text style={styles.hotelAddress} numberOfLines={2}>
                {hotel.address}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  hotelItem: {
    width: COLUMN_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  hotelImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  hotelInfo: {
    padding: 8,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hotelAddress: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
});

export default HomelistHotel;