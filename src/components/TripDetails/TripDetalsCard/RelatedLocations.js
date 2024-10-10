import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Carousel from '../../shared/Carousel';
import Icon from '../../shared/Icon';
import Rating from '../../shared/Rating/Rating';
import Card from '../../shared/Card/card';
import CardFavoriteIcon from '../../shared/Card/CardFavoriteIcon';
import CardMedia from '../../shared/Card/CardMedia';
import CardContent from '../../shared/Card/CardContent';
import { colors, sizes, spacing } from '../../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore'; // Import Firestore

const CARD_HEIGHT = 200;

const RelatedLocations = ({ location }) => {
  const navigation = useNavigation();
  const [locations, setLocations] = useState([]); // State to store places and topPlaces

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const placesSnapshot = await firestore()
          .collection('places')
          .where('location', '==', location)
          .get();

        console.log('Places Snapshot:', placesSnapshot);

        const placesData = placesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const topPlacesSnapshot = await firestore()
          .collection('topPlaces')
          .where('location', '==', location)
          .get();

        console.log('Top Places Snapshot:', topPlacesSnapshot);

        const topPlacesData = topPlacesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const combinedData = [...placesData, ...topPlacesData];
        console.log('Combined Data:', combinedData); // Log combined data
        setLocations(combinedData);
      } catch (error) {
        console.error('Error fetching locations: ', error);
      }
    };

    fetchLocations();
  }, [location]);

  const handleLocationDetails = (locationData) => {
    console.log("Navigating to TripDetails with data: ", locationData);
    navigation.navigate('TripDetails', { trip: locationData });
  };

  return (
    <View style={styles.container}>
      {locations.length > 0 ? (
  <Carousel
    items={locations}
    renderItem={({ item, style }) => (
      <Card
        style={[styles.card, style]}
        onPress={() => handleLocationDetails(item)}>
        <CardFavoriteIcon active={false} />
        <CardMedia source={{ uri: item.imageUrl }} />
        <CardContent style={styles.content}>
          <View style={styles.titleBox}>
            <Text
              style={styles.title}
              numberOfLines={1}
              ellipsizeMode="tail">
              {item.title ? item.title : "Không có tiêu đề"}  {/* Đảm bảo có chuỗi để hiển thị */}
            </Text>
            <View style={styles.locationBox}>
              <Text style={styles.location}>
                {item.location ? item.location : "Không có địa điểm"}  {/* Đảm bảo có chuỗi để hiển thị */}
              </Text>
              <Icon
                icon="Location"
                size={18}
                style={styles.locationIcon}
              />
            </View>
            <Rating
              showLabelInline
              rating={Number(item.starRating) || 0}
              size={12}
              containerStyle={styles.rating}
            />
          </View>
        </CardContent>
      </Card>
    )}
  />
) : (
  <Text style={styles.noLocationsText}>
    Không có địa điểm nào ở địa điểm này.
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
  noLocationsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: sizes.body,
    color: colors.gray,
  },
});

export default RelatedLocations;
