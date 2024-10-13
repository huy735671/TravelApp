import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import Icon from '../components/shared/Icon';
import FavoriteButton from '../components/shared/FavoriteButton';
import HotelDetailsCarousel from '../components/Hotels/HotelDetailsCarousel';

const HotelDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { hotelId } = route.params;
  const [hotel, setHotel] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const hotelDoc = await firestore().collection('hotels').doc(hotelId).get();
        if (hotelDoc.exists) {
          setHotel({ id: hotelDoc.id, ...hotelDoc.data() });
        }
      } catch (error) {
        console.error('Error fetching hotel details: ', error);
      }
    };

    fetchHotelDetails();
  }, [hotelId]);

  useEffect(() => {
    // Lấy thông tin người dùng hiện tại
    const user = auth().currentUser;
    if (user) {
      setUserEmail(user.email); // Lưu email của người dùng
    }
  }, []);

  const handleFavoritePress = async () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    if (userEmail) {
      await firestore()
        .collection('favorites')
        .doc(userEmail) // Sử dụng email làm document ID
        .set(
          {
            [hotelId]: newFavoriteStatus, // Lưu trạng thái yêu thích cho khách sạn
          },
          { merge: true }
        )
        .catch((error) => {
          console.error('Error updating favorite status: ', error);
        });
    }
  };

  // Lấy trạng thái yêu thích từ Firestore khi component được mount
  useEffect(() => {
    if (userEmail) {
      const unsubscribe = firestore()
        .collection('favorites')
        .doc(userEmail)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const data = doc.data();
            setIsFavorite(data[hotelId] || false); // Cập nhật trạng thái yêu thích
          }
        });

      return () => unsubscribe();
    }
  }, [hotelId, userEmail]);

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
        <FavoriteButton active={isFavorite} onPress={handleFavoritePress} />
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
