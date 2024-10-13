import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, StatusBar } from 'react-native';
import { colors, shadow, sizes, spacing } from '../constants/theme';
import Icon from '../components/shared/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import TripDetailsCard from '../components/TripDetails/TripDetalsCard/TripDetailsCard';
import FavoriteButton from '../components/shared/FavoriteButton';
import TripDetailsCarousel from '../components/TripDetails/TripDetailsCarousel';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const TripDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { trip } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Lấy thông tin người dùng hiện tại
    
    const user = auth().currentUser;
    if (user) {
      setUserEmail(user.email); // Lưu email của người dùng
    }
  }, []);

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.red }}>No trip data available.</Text>
      </View>
    );
  }

  const slides = [trip.imageUrl, ...trip.gallery];

  // Hàm xử lý khi nhấn nút yêu thích
  const handlePress = async () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    // Lưu trạng thái yêu thích vào Firestore
    if (userEmail) {
      const tripId = trip.id; // ID của chuyến đi

      await firestore()
        .collection('favorites')
        .doc(userEmail) // Sử dụng email làm document ID
        .set(
          {
            [tripId]: newFavoriteStatus,
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
      const tripId = trip.id; // ID của chuyến đi

      const unsubscribe = firestore()
        .collection('favorites')
        .doc(userEmail)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const data = doc.data();
            setIsFavorite(data[tripId] || false);
          }
        });

      return () => unsubscribe();
    }
  }, [trip.id, userEmail]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
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
        <FavoriteButton active={isFavorite} onPress={handlePress} />
      </Animatable.View>

      <TripDetailsCarousel slides={slides} id={trip.id} />
      <TripDetailsCard trip={trip} />
    </View>
  );
};

TripDetailsScreen.sharedElements = route => {
  const { trip } = route.params;
  return [
    {
      id: `trip.${trip.id}.image`,
    },
  ];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    left: spacing.l,
    zIndex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    right: spacing.l,
    zIndex: 1,
  },
  backIcon: {
    backgroundColor: colors.white,
    padding: 4,
    borderRadius: sizes.radius,
    ...shadow.light,
  },
});

export default TripDetailsScreen;
