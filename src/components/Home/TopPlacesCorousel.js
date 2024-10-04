import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import Carousel from '../shared/Carousel';
import Card from '../shared/Card/card';
import CardFavoriteIcon from '../shared/Card/CardFavoriteIcon';
import { colors, sizes } from '../../constants/theme';
import CardMedia from '../shared/Card/CardMedia';
import firestore from '@react-native-firebase/firestore'; // Sử dụng Firestore từ Firebase SDK

const CARD_HEIGHT = 200;

const TopPlacesCarousel = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const placesList = [];
        const querySnapshot = await firestore().collection('topPlaces').get(); 
        querySnapshot.forEach(doc => {
          placesList.push({ id: doc.id, ...doc.data() });
        });
        setList(placesList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching places:', error);
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  return (
    <Carousel
      items={list}
      renderItem={({ item, style }) => (
        <Card
          style={[styles.card, style]}
          shadowType="dark"
          onPress={() => {
            navigation.navigate('TripDetails', { trip: item });
          }}
        >
          <CardFavoriteIcon active={false} onPress={() => {}} />
          <SharedElement
            id={`trip.${item.id}.image`}
            style={StyleSheet.absoluteFillObject}
          >
            <CardMedia source={{ uri: item.image }} borderBottomRadius />
          </SharedElement>
          <View style={styles.titleBox}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
  },
  titleBox: {
    position: 'absolute',
    top: CARD_HEIGHT - 80,
    left: 16,
  },
  title: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.white,
  },
  location: {
    fontSize: sizes.h3,
    color: colors.white,
  },
});

export default TopPlacesCarousel;
