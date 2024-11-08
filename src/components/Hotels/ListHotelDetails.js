import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  View,
  StatusBar,
  TextInput,
} from 'react-native';
import { colors, shadow, sizes, spacing } from '../../constants/theme';
import firestore from '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../shared/Icon';
import { useNavigation } from '@react-navigation/native';
import StarRating from '../shared/Rating/Rating';

const ListHotelDetails = ({ route }) => {
  const { location } = route.params;
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false); // State to control filter visibility
  const [selectedStarRating, setSelectedStarRating] = useState(null); // State for star rating filter
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const snapshot = await firestore()
          .collection('hotels')
          .where('location', '==', location)
          .get();

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
  }, [location]);

  const handleSearch = text => {
    setSearch(text);
  };
  const formatPrice = price => {
    if (price === 0) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  // Function to filter hotels based on search query and star rating
  // Function to filter hotels based on search query and star rating
const filteredHotels = hotels.filter(hotel => {
  const matchesSearch =
    hotel.title.toLowerCase().includes(search.toLowerCase()) ||
    hotel.address.toLowerCase().includes(search.toLowerCase());

  const matchesStarRating = selectedStarRating
    ? Number(hotel.starRating) === selectedStarRating // Chuyển đổi hotel.starRating thành số
    : true;


  return matchesSearch && matchesStarRating;
});


  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }


  const renderHotelItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('HotelDetails', { hotelId: item.id })}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="#4c8d6e"
      />
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardDetails}>
        <Text style={styles.hotelName}>{item.title}</Text>
        {item.starRating && item.starRating > 0 ? (
        <StarRating
          showLabelInline
          rating={Number(item.starRating)}
          size={20}
          containerStyle={styles.rating}
        />
        ):(
          <Text style={styles.noRatingText}>Chưa có đánh giá</Text>
        )}
        <Text>{item.address}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.bodyText}>
            Giá một đêm: {formatPrice(item.pricePerNight)} VND
          </Text>
          <Text>Đã bao gồm thuế và phí</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderStarRatingFilter = () => (
    <View style={styles.ratingFilterContainer}>
      {[1, 2, 3, 4, 5].map(star => (
        <TouchableOpacity
          key={star}
          style={[
            styles.starButton,
            selectedStarRating === star && styles.selectedStarButton 
          ]}
          onPress={() => {
            if (selectedStarRating === star) {
              // Nếu đã chọn sao này, xóa bộ lọc
              setSelectedStarRating(null);
            } else {
              // Nếu chưa chọn, thiết lập sao đã chọn
              setSelectedStarRating(star);
            }
          }}
        >
          <Text style={styles.starText}>{star} ⭐</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  
 
  

  return (
    <View style={styles.container}>
      <Animatable.View
        style={[styles.backButton, { marginTop: insets.top }]}
        animation="fadeIn"
        delay={500}
        duration={400}
        easing="ease-in-out">
        <Icon
          icon="Back"
          style={styles.backIcon}
          size={40}
          onPress={navigation.goBack}
        />
      </Animatable.View>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Khách sạn ở {location}</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.inner}>
          <View style={styles.search}>
            <Icon icon="Search" />
          </View>
          <TextInput
            style={styles.field}
            placeholder="Tìm kiếm"
            value={search}
            onChangeText={handleSearch}
          />
          <View style={styles.filter}>
            <Icon
              icon="Filter"
              onPress={() => setFilterVisible(!filterVisible)}
            />
          </View>
        </View>
      </View>

      {/* Filtered star rating */}
      {filterVisible && renderStarRatingFilter()}

      <FlatList
        data={filteredHotels}
        keyExtractor={item => item.id}
        renderItem={renderHotelItem}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  backButton: {
    backgroundColor: '#4c8d6e',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  selectedStarButton:{
   
      backgroundColor: '#4c8d6e', // Thay đổi màu nền của nút đã chọn
      borderRadius: 5,
      elevation: 5,
  },
  headerContainer: {
    paddingTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: colors.primary,
  },
  flatListContainer: {
    paddingBottom: 20,
    marginHorizontal: 10,
  },
  card: {
    marginVertical: 10,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: colors.white,
    flexDirection: 'row',
    padding: 10,
  },
  cardImage: {
    height: 150,
    width: '30%',
    borderRadius: 10,
  },
  cardDetails: {
    flexDirection: 'column',
    marginHorizontal: 10,
    flex: 1,
  },
  hotelName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
    color: colors.primary,
  },
  bodyText: {
    fontSize: sizes.h3,
    color: colors.black,
  },
  priceContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    alignItems: 'flex-end',
  },
  searchContainer: {
    marginVertical: 10,
    paddingHorizontal: spacing.l,
  },
  inner: {
    flexDirection: 'row',
  },
  search: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  field: {
    backgroundColor: colors.white,
    paddingLeft: spacing.xl + spacing.s,
    paddingRight: spacing.m,
    paddingVertical: spacing.m,
    borderRadius: sizes.radius,
    height: 54,
    flex: 1,
    elevation: 5,
    ...shadow.light,
  },
  filter: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  ratingFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  starButton: {
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
    elevation: 3,
  },
  starText: {
    fontSize: 16,
    color: colors.primary,
  },
});

export default ListHotelDetails;
