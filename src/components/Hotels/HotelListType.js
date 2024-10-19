import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,  // Import TouchableOpacity
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable';
import Icon from '../shared/Icon';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import StarRating from '../shared/Rating/Rating';
import {colors, sizes} from '../../constants/theme';

const HotelListType = ({route}) => {
  const {hotelType} = route.params;
  const [hotels, setHotels] = useState([]);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const snapshot = await firestore()
          .collection('hotels')
          .where('hotelType', '==', hotelType)
          .get();

        console.log('Fetching hotels for type:', hotelType);
        const hotelData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(hotelData); // Ghi nhận dữ liệu
        setHotels(hotelData);
      } catch (error) {
        console.error('Error fetching hotels: ', error);
      }
    };
    fetchHotels();
  }, [hotelType]);

  // Chuyển đổi loại khách sạn thành tên hiển thị
  const getHotelTypeDisplayName = type => {
    switch (type) {
      case 'business':
        return 'Khách sạn';
      case 'apartment':
        return 'Căn hộ';
      case 'resort':
        return 'Resort';
      case 'villa':
        return 'Biệt thự';
      default:
        return 'Loại không xác định';
    }
  };

  const formatPrice = price => {
    if (price === 0) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const renderHotelItem = ({item}) => (
    <TouchableOpacity
      style={styles.hotelCard}
      onPress={() => navigation.navigate('HotelDetails', {hotelId: item.id})} // Điều hướng đến HotelDetails
    >
      <Image
        source={{uri: item.imageUrl}}
        style={styles.hotelImage}
        resizeMode="cover"
      />
      <View style={{flexDirection: 'column', marginHorizontal: 10, flex: 1}}>
        <Text style={styles.hotelName}>
          {item.title ? item.title : 'Khách sạn không tên'}
        </Text>

        <StarRating
          showLabelInline
          rating={Number(item.starRating)}
          size={20}
          containerStyle={styles.rating}
        />
        
        <Text>{item.address}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            Giá một đêm: {formatPrice(item.pricePerNight)} VND
          </Text>
          <Text>Đã bao gồm thuế và phí</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View
        style={[styles.backButton, {marginTop: insets.top}]}
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

      <Text style={styles.title}>
        {getHotelTypeDisplayName(hotelType)} gần đây bạn có thể đặt ngay
      </Text>
      {hotels.length === 0 ? (
        <Text>Không có khách sạn nào với loại này.</Text>
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={item => item.id}
          renderItem={renderHotelItem}
          contentContainerStyle={styles.hotelList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 20,
    color: '#333',
  },
  hotelList: {
    paddingBottom: 20,
  },
  hotelCard: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  hotelImage: {
    height: 150,
    width: '30%',
    borderRadius: 10,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  backButton: {
    backgroundColor: '#4c8d6e',
  },
  priceText: {
    fontSize: sizes.h3,
    color: colors.black,
  },
  priceContainer: {
    position: 'absolute', 
    bottom: 10,
    right: 10, 
    alignItems: 'flex-end',
  },
});

export default HotelListType;
