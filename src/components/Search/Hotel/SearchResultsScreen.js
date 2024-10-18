import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import Icon
import { colors, sizes } from '../../../constants/theme';

const SearchResultsScreen = ({ route, navigation }) => {
  const { location } = route.params; // Nhận location từ SearchBar
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelsByLocation = async () => {
      try {
        const snapshot = await firestore()
          .collection('hotels')
          .where('location', '==', location) // Tìm khách sạn theo location
          .get();
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

    fetchHotelsByLocation();
  }, [location]);

  const renderStars = (starRating) => {
    if (starRating === 0) {
      return null; // Không hiển thị gì nếu số sao là 0
    }
    const stars = [];
    const fullStars = Math.floor(starRating); // Số ngôi sao đầy đủ
    const halfStar = starRating - fullStars >= 0.5; // Có ngôi sao nửa không

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={i} name="star" size={16} color="#FFD700" />); // Ngôi sao đầy đủ
    }
    if (halfStar) {
      stars.push(<Icon key="half" name="star-half" size={16} color="#FFD700" />); // Ngôi sao nửa
    }

    return (
      <View style={styles.starContainer}>
        {stars}
        {/* Hiển thị số sao ở sau biểu tượng ngôi sao */}
        <Text style={styles.starText}> {starRating}</Text>
      </View>
    );
  };

  const Card = ({ hotel }) => (
    <View style={styles.card}>
      <View >
        <Image source={{ uri: hotel.imageUrl }} style={styles.cardImage} />
        <View style={styles.cardDetails}>
          <Text style={styles.hotelName}>{hotel.title}</Text>
          <Text style={styles.hotelLocation}>{hotel.location}</Text>
          <Text style={styles.priceText}>{hotel.pricePerNight} Vnd/đêm</Text>

          {/* Hiển thị biểu tượng ngôi sao và số sao */}
          {renderStars(hotel.starRating || 0)}
        </View>
      </View>

      {/* Nút Đặt Ngay */}
      <TouchableOpacity
        style={styles.bookNowButton}
        onPress={() => navigation.navigate('HotelDetails', { hotelId: hotel.id })}
      >
        <Text style={styles.bookNowButtonText}>Đặt ngay</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.searchResultText}>
        Kết quả tìm kiếm cho "{location}"
      </Text>

      {/* Danh sách khách sạn */}
      <FlatList
        data={hotels}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Card hotel={item} />}
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={<Text>Không có kết quả phù hợp.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  searchResultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  card: {
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: colors.white,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardDetails: {
    padding: 10,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  hotelLocation: {
    color: colors.grey,
    marginBottom: 5,
  },
  priceText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginTop: 5,
  },
  starText: {
    marginLeft: 5,
    fontSize: 14,
    color: colors.grey,
  },
  bookNowButton: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:sizes.radius,
    marginHorizontal: 10, 
    marginBottom:10,
    padding:10,

  },
  bookNowButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  flatListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default SearchResultsScreen;
