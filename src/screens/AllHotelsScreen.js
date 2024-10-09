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
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { colors, shadow, sizes } from '../constants/theme';
import MainHeader from '../components/shared/MainHeader';
import Icon from '../components/shared/Icon';
import HotelsList from '../components/Hotels/hotelsList';
import LocationsScreen from '../components/Hotels/LocationsScreen';

const { width } = Dimensions.get('screen');
const cardWidth = width * 0.85;

const AllHotelsScreen = ({ navigation }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [userAddress, setUserAddress] = useState('');

  // Hàm để lấy địa chỉ của người dùng
  const fetchUserAddress = async () => {
    const user = auth().currentUser;
    if (user) {
      const email = user.email; // Lấy email của người dùng hiện tại
      await getAddressFromFirestore(email); // Gọi hàm để lấy địa chỉ từ Firestore
    } else {
      console.log('No user is currently signed in.');
    }
  };

  // Hàm để tìm địa chỉ trong Firestore
  const getAddressFromFirestore = async (email) => {
    try {
      const userDoc = await firestore().collection('users').where('email', '==', email).get();
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data(); // Lấy dữ liệu từ tài liệu đầu tiên
        const address = userData.address; // Giả sử địa chỉ nằm trong trường 'address'
        setUserAddress(address); // Lưu địa chỉ vào state
        console.log('User Address:', address); // Kiểm tra giá trị của địa chỉ
      } else {
        console.log('User document not found'); // Nếu không tìm thấy tài liệu người dùng
      }
    } catch (error) {
      console.error('Error fetching user address:', error);
    }
  };

  // Hàm để lấy danh sách khách sạn
  const fetchHotels = async () => {
    try {
      const snapshot = await firestore().collection('hotels').get();
      const hotelsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Lọc khách sạn theo địa chỉ của người dùng
      const filteredByAddress = hotelsList.filter(hotel => hotel.location === userAddress);
      setHotels(hotelsList);
      setFilteredHotels(filteredByAddress); 
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAddress(); // Gọi hàm để lấy địa chỉ người dùng
  }, []);

  useEffect(() => {
    if (userAddress) {
      fetchHotels(); // Gọi hàm để lấy danh sách khách sạn khi có địa chỉ người dùng
    }
  }, [userAddress]);

  const handleSearch = text => {
    setSearchQuery(text);
    if (text) {
      const filtered = filteredHotels.filter(hotel =>
        hotel.hotelName.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredHotels(filtered);
    } else {
      fetchHotels(); // Lấy lại danh sách khách sạn nếu không có từ khóa tìm kiếm
    }
  };

  const Card = ({ hotel }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('HotelDetails', { hotelId: hotel.id })}>
      <Image source={{ uri: hotel.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardDetails}>
        <Text style={styles.hotelName}>{hotel.title}</Text>
        <Text style={styles.hotelLocation}>{hotel.location}</Text>
        <Text style={styles.priceText}>{hotel.pricePerNight} Vnd/Night</Text>
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
    <ScrollView style={styles.container}>
      <MainHeader title="Travel app" />

      <View style={styles.header}>
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

      <Text style={styles.headerTitle}>Khách sạn gần bạn</Text>
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

      <Text style={styles.headerTitle}>Bạn cần gợi ý?</Text>
      <HotelsList />

      <Text style={styles.headerTitle}>Tìm theo chỗ nghỉ</Text>
      <LocationsScreen />

      <Text style={styles.headerTitle}>Lên kế hoạch dễ dàng và nhanh chóng </Text>
          
    </ScrollView>
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
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.primary,
    paddingLeft: 20,
    paddingVertical: 10,
  },
  searchInput: {
    borderColor: colors.grey,
    borderWidth: 1,
    borderColor: '#ddd',
    borderWidth: 1,
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
  flatListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
