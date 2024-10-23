import React, {useRef, useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import {colors, shadow, sizes, spacing} from '../../constants/theme';
import StarRating from '../shared/Rating/Rating';
// import Icon from '../shared/Icon';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RoomsBottomSheet from './RoomsBottomSheet';
import HotelReviews from '../Reviews/Hotels/HotelReviews';
import firestore from '@react-native-firebase/firestore';
import Divider from '../shared/Divider';

const HotelDetailsCarousel = ({hotel}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [cheapestRoom, setCheapestRoom] = useState(null);

  const fetchCheapestRoom = async hotelId => {
    try {
      const roomsSnapshot = await firestore()
        .collection('rooms')
        .where('hotelId', '==', hotelId)
        .where('roomType', '==', 'Phòng đôi')
        .get();

      const roomsList = roomsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const cheapestRoom = roomsList.reduce((prev, curr) => {
        return prev.pricePerNight < curr.pricePerNight ? prev : curr;
      }, roomsList[0]);

      return cheapestRoom;
    } catch (error) {
      console.error('Error fetching cheapest room:', error);
      return null;
    }
  };

  const updateHotelPrice = async (hotelId, price) => {
    try {
      await firestore().collection('hotels').doc(hotelId).update({
        pricePerNight: price,
      });
      console.log('Hotel price updated successfully');
    } catch (error) {
      console.error('Error updating hotel price:', error);
    }
  };

  const formatPrice = price => {
    if (price === 0) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  useEffect(() => {
    const loadCheapestRoom = async () => {
      if (hotel) {
        const room = await fetchCheapestRoom(hotel.id);
        setCheapestRoom(room);
        if (room) {
          await updateHotelPrice(hotel.id, room.pricePerNight);
        }
      }
    };

    loadCheapestRoom();
  }, [hotel]);

  if (!hotel) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  const renderAmenities = () => {
    return hotel.amenities.map((amenity, index) => (
      <View key={index} style={styles.amenityItem}>
        <Text style={styles.amenityText}>{amenity}</Text>
      </View>
    ));
  };

  const imageHeight = scrollY.interpolate({
    inputRange: [0, 400],
    outputRange: [300, 100],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <Animated.Image
        source={{uri: hotel.imageUrl}}
        style={[styles.image, {height: imageHeight}]}
      />

      <Animated.ScrollView
        style={styles.content}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}>
        <View style={{marginTop: 20, paddingHorizontal: 16,}}>
          <Text style={[styles.title,{marginBottom: 10}]}>{hotel.title}</Text>

          <StarRating
            showLabelInline
            rating={Number(hotel.starRating)}
            size={20}
            containerStyle={styles.rating}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Ionicons
              name="location-outline"
              size={25}
              color={colors.primary}
            />
            <Text style={[styles.location,{marginTop:10}]}>
              {hotel.address}
              {'\n'}
              {hotel.location}
            </Text>
          </View>
        </View>

        <View style={{padding: 16}}>
          <Text style={styles.amenitiesHeaderText}>Mô tả</Text>
          <Text style={styles.description}>{hotel.description}</Text>
        </View>

        <View style={styles.amenitiesHeader}>
          <Text style={styles.amenitiesHeaderText}>
            Tiện nghi
          </Text>
        </View>

        <View style={styles.amenitiesContainer}>{renderAmenities()}</View>
        <Divider />
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>Giá cho 1 đêm {'\n'}2 người</Text>
          <View style={styles.priceTag}>
            <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 5}}>
              {cheapestRoom ? formatPrice(cheapestRoom.pricePerNight) : '0'} VND
            </Text>
          </View>
        </View>

        <Divider />
        <View style={styles.reviewContainer}>
          <Text style={styles.reviewContainerText}>
            Đánh giá
          </Text>
          <HotelReviews hotelId={hotel.id} />
        </View>
      </Animated.ScrollView>

      <TouchableOpacity
        style={styles.btnContainer}
        onPress={() => setBottomSheetVisible(true)}>
        <Text style={styles.btnText}>Chọn phòng</Text>
      </TouchableOpacity>

      {isBottomSheetVisible && (
        <RoomsBottomSheet
          hotelId={hotel.id}
          onClose={() => setBottomSheetVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.primary,

  },
  location: {
    fontSize: sizes.body,
    fontWeight: '400',
    color: colors.gray,
    marginTop: 5,
  },
  priceContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  priceText: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.primary,
  },
  priceTag: {
    height: 40,
    alignItems: 'center',
    marginLeft: 40,
    paddingLeft: 20,
    flex: 1,
    backgroundColor: '#c9dcda',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    flexDirection: 'row',
  },
  description: {
    lineHeight: 20,
    fontSize: sizes.body + 1,
    color: colors.gray,
    marginTop: spacing.s,
  },
  btnContainer: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4c8d6e',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  btnText: {
    fontSize: sizes.body,
    color: colors.white,
    fontWeight: 'bold',
  },
  reviewContainer: {
    padding: 16,
  },
  reviewContainerText: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  amenitiesHeader: {
    padding: 16,
  },
  amenitiesHeaderText: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.primary,
    backgroundColor:colors.light,
    elevation: 2,
    ...shadow.light,
    alignSelf:'flex-start',
    paddingHorizontal:20,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
  },
  amenityItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  amenityText: {
    fontSize: sizes.body,
  },
});

export default HotelDetailsCarousel;
