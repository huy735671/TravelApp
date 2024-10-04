import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { colors, shadow } from '../constants/theme';
import MainHeader from '../components/shared/MainHeader';
import Icon from '../components/shared/Icon';

const { width } = Dimensions.get('screen');
const cardWidth = width * 0.85;

const AllHotelsScreen = ({ navigation }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHotels, setFilteredHotels] = useState([]);

  const categories = ['All', 'Popular', 'Top Rated', 'Luxury'];

  const fetchHotels = async () => {
    try {
      const snapshot = await firestore().collection('hotels').get();
      const hotelsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHotels(hotelsList);
      setFilteredHotels(hotelsList); // Initialize filtered hotels
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSearch = text => {
    setSearchQuery(text);
    if (text) {
      const filtered = hotels.filter(hotel =>
        hotel.hotelName.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredHotels(filtered);
    } else {
      setFilteredHotels(hotels);
    }
  };

  const handleCategorySelect = category => {
    if (category === 'All') {
      setFilteredHotels(hotels);
    } else {
      const filtered = hotels.filter(hotel => hotel.category === category);
      setFilteredHotels(filtered);
    }
  };

  const Card = ({ hotel }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('HotelDetails', { hotelId: hotel.id })}>
      <Image source={{ uri: hotel.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardDetails}>
        <Text style={styles.hotelName}>{hotel.hotelName}</Text>
        <Text style={styles.hotelLocation}>{hotel.location}</Text>
        <Text style={styles.priceText}>{hotel.pricePeerDay} Vnd/day</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <MainHeader title="Travel app" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Hotels</Text>
        <View style={styles.inner}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search hotels..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <Icon icon="Search" style={styles.searchIcon} />
        </View>
      </View>

      {/* Categories Section */}
      <View style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryButton}
            onPress={() => handleCategorySelect(category)}>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Hotels List */}
      <FlatList
        data={filteredHotels}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Card hotel={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
        snapToInterval={cardWidth}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.primary,
  },
  searchInput: {
    borderColor: colors.grey,
    borderWidth: 1,
    borderColor:'#ddd',
    borderWidth:1,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 50, 
    marginTop: 10,
    backgroundColor: colors.light,
    flex: 1, 
    elevation: 5,
    ...shadow.light,
  },
  searchIcon: {
    position: 'absolute',
    top: 15,
    left: 15, 
    zIndex: 1,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: 'center',
  },
  categoryText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  flatListContainer: {
    paddingHorizontal: 20,
  },
  card: {
    width: cardWidth,
    elevation: 5,
    borderRadius: 15,
    backgroundColor: colors.white,
    marginRight: 20,
    overflow: 'hidden',
    height: 220,
  },
  cardImage: {
    height: '60%',
    width: '100%',
  },
  cardDetails: {
    padding: 10,
    height: '40%',
  },
  hotelName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  hotelLocation: {
    color: colors.grey,
    marginBottom: 5,
    fontSize: 14,
  },
  priceText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AllHotelsScreen;
