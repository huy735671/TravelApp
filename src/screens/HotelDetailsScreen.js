import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import Icon from '../components/shared/Icon';
import FavoriteButton from '../components/shared/FavoriteButton';
import HotelDetailsCarousel from '../components/Hotels/HotelDetailsCarousel';

const HotelDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { hotelId } = route.params;
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const hotelDoc = await firestore().collection('hotels').doc(hotelId).get();
        if (hotelDoc.exists) {
          setHotel({ id: hotelDoc.id, ...hotelDoc.data() });
        } else {
        }
      } catch (error) {
        console.error('Error fetching hotel details: ', error);
      }
    };

    fetchHotelDetails();
  }, [hotelId]);

  return (
    <View style={styles.container}>
      <Animatable.View
        style={[styles.backButton, { marginTop: insets.top }]}
        animation="fadeIn"
        delay={500}
        duration={400}
        easing="ease-in-out">
        <Icon icon="Back" style={styles.backIcon} onPress={navigation.goBack} />
      </Animatable.View>

      <Animatable.View
        style={[styles.favoriteButton, { marginTop: insets.top }]}
        animation="fadeIn"
        delay={500}
        duration={400}
        easing="ease-in-out">
        <FavoriteButton onPress={() => {}} />
      </Animatable.View>

      {hotel && <HotelDetailsCarousel hotel={hotel} />}
    </View>
  );
};

export default HotelDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    right: 20,
    zIndex: 1,
  },
  backIcon: {
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 20,
  },
});
