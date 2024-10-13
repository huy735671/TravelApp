import React, {useRef, useState} from 'react';
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
import {colors, sizes, spacing} from '../../constants/theme';
import StarRating from '../shared/Rating/Rating';
import RatingOverall from '../shared/Rating/RatingOverall';
import Icon from '../shared/Icon';
import RoomsBottomSheet from './RoomsBottomSheet'; // Import the BottomSheet component
import HotelReviews from '../Reviews/Hotels/HotelReviews';
import SectionHeader from '../shared/SectionHeader';

const HotelDetailsCarousel = ({hotel}) => {
  const scrollY = useRef(new Animated.Value(0)).current; // Khởi tạo giá trị Animated
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false); // State to control BottomSheet

  if (!hotel) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  // Render Amenities
  const renderAmenities = () => {
    return hotel.amenities.map((amenity, index) => (
      <View key={index} style={styles.amenityItem}>
        <Text style={styles.amenityText}>{amenity}</Text>
      </View>
    ));
  };

  // Tính toán chiều cao hình ảnh dựa trên scrollY
  const imageHeight = scrollY.interpolate({
    inputRange: [0, 400], // Giới hạn cho animation
    outputRange: [300, 100], // Chiều cao ban đầu và chiều cao khi thu nhỏ
    extrapolate: 'clamp', // Giới hạn giá trị đầu ra
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <Animated.Image // Sử dụng Animated.Image
        source={{uri: hotel.imageUrl}}
        style={[styles.image, {height: imageHeight}]} // Áp dụng chiều cao đã tính toán
      />

      <Animated.ScrollView // Sử dụng Animated.ScrollView
        style={styles.content}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16} // Tối ưu hiệu suất
      >
        <View style={{marginTop: 20, paddingHorizontal: 20}}>
          <Text style={styles.title}>{hotel.title}</Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon icon="Location" size={30} />
            <Text style={styles.location}>
              {hotel.address}
              {'\n'}
              {hotel.location}
            </Text>
          </View>
          <View style={{marginTop: 5}}>
            
            <StarRating
              showLabelInline
              rating={Number(hotel.starRating)}
              size={20}
              containerStyle={styles.rating}
            />
          </View>

          <Text style={styles.description}>{hotel.description}</Text>
        </View>

        {/* Amenities Section */}
        <View style={styles.amenitiesHeader}>
          <Text style={styles.amenitiesHeaderText}>
            Cực kỳ phù hợp cho kỳ lưu trú của bạn
          </Text>
        </View>

        <View style={styles.amenitiesContainer}>{renderAmenities()}</View>

        {/* Price Section */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>Giá cho 1 đêm {'\n'}2 người</Text>
          <View style={styles.priceTag}>
            <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 5}}>
              {hotel.pricePerNight} VND
            </Text>
          </View>
        </View>

        <View style={styles.reviewContainer}>
          <Text style={styles.reviewContainerText}>
            Đánh giá của khách hàng
          </Text>
         
          
          <HotelReviews hotelId={hotel.id} />
        </View>
      </Animated.ScrollView>

      <TouchableOpacity
        style={styles.btnContainer}
        onPress={() => setBottomSheetVisible(true)} // Open bottom sheet
      >
        <Text style={styles.btnText}>Chọn phòng</Text>
      </TouchableOpacity>

      {/* Rooms Bottom Sheet */}
      {isBottomSheetVisible && (
        <RoomsBottomSheet
          hotelId={hotel.id} // Pass the hotel ID
          onClose={() => setBottomSheetVisible(false)} // Close function
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
    borderTopWidth: 1,
    paddingVertical: 10,
    borderColor: '#ddd',
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
    marginVertical: 20,
  },
  btnText: {
    color: colors.light,
    fontSize: sizes.h3,
    fontWeight: 'bold',
  },
  // Amenities styling
  amenitiesHeader: {
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  amenitiesHeaderText: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.primary,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  amenityItem: {
    backgroundColor: '#e6f7f5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  amenityText: {
    fontSize: sizes.body,
    color: colors.primary,
  },
  reviewContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  reviewContainerText: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.primary,
  },
  reviewdetals: {
    marginTop: 20,
    flexDirection: 'row',
    paddingVertical: 10,
  },
  imageUserReview: {
    height: 50,
    width: 50,
    borderRadius: 20,
  },
  reviewUserName: {
    fontSize: spacing.m,
    fontWeight: 'bold',
    color: colors.primary,
    marginHorizontal: 20,
  },
});

export default HotelDetailsCarousel;
