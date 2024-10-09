import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Carousel from '../../shared/Carousel';
import Icon from '../../shared/Icon';
import Rating from '../../shared/Rating/Rating';
import Card from '../../shared/Card/card';
import CardFavoriteIcon from '../../shared/Card/CardFavoriteIcon';
import CardMedia from '../../shared/Card/CardMedia';
import CardContent from '../../shared/Card/CardContent';
import {colors, sizes, spacing} from '../../../constants/theme';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore'; // Import Firestore

const CARD_HEIGHT = 200;

const HotelsCarousel = ({location}) => {
  const navigation = useNavigation();
  const [hotels, setHotels] = useState([]); // State to store hotels

  useEffect(() => {
    // Fetch hotels from Firestore
    const fetchHotels = async () => {
      try {
        const snapshot = await firestore().collection('hotels').get();
        const hotelsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(hotelsData); // Thêm dòng này để kiểm tra dữ liệu
        setHotels(hotelsData);
      } catch (error) {
        console.error('Error fetching hotels: ', error);
      }
    };

    fetchHotels();
  }, []);

  const handlerHotelDetails = hotelId => {
    navigation.navigate('HotelDetails', {hotelId});
  };

  // Lọc các khách sạn theo địa điểm
  const filteredHotels = hotels.filter(hotel => hotel.location === location);

  return (
    <View style={styles.container}>
      {filteredHotels.length > 0 ? (
        <Carousel
          items={filteredHotels}
          renderItem={({item, style}) => (
            <Card
              style={[styles.card, style]}
              onPress={() => handlerHotelDetails(item.id)}>
              <CardFavoriteIcon active={false} />
              <CardMedia source={{uri: item.imageUrl}} />
              <CardContent style={styles.content}>
                <View style={styles.titleBox}>
                  <Text
                    style={styles.title}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.title}
                  </Text>
                  <View style={styles.locationBox}>
                    <Text style={styles.location}>{item.location}</Text>
                    <Icon
                      icon="Location"
                      size={18}
                      style={styles.locationIcon}
                    />
                  </View>
                  <Rating
                    showLabelInline
                    rating={Number(item.starRating)}
                    size={12}
                    containerStyle={styles.rating}
                  />
                </View>
                <View style={styles.priceBox}>
                  <Text style={styles.price}>{item.pricePerNight} VND</Text>
                  <Text style={styles.priceCaption}>Giá 1 đêm cho 2 người</Text>
                </View>
              </CardContent>
            </Card>
          )}
        />
      ) : (
        <Text style={styles.noHotelsText}>
          Không có khách sạn nào ở địa điểm này.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    width: sizes.width - 40,
  },
  content: {
    height: 88,
  },
  titleBox: {
    flex: 1,
  },
  title: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: colors.primary,
    
    
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 2,
  },
  location: {
    fontSize: sizes.caption,
    color: colors.lightGray,
  },
  locationIcon: {
    tintColor: colors.gray,
  },
  rating: {
    marginTop: spacing.m / 2,
  },
  priceBox: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  price: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: colors.primary,
  },
  priceCaption: {
    fontSize: sizes.caption,
    color: colors.lightGray,
    marginTop: 2,
  },
  noHotelsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: sizes.body,
    color: colors.gray,
  },
});

export default HotelsCarousel;
