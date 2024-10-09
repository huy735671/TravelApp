import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { colors, sizes, spacing } from '../../constants/theme';
import FavoriteButton from '../shared/FavoriteButton';
import { useNavigation } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import Card from '../shared/Card/card';
import CardMedia from '../shared/Card/CardMedia';
import CardContent from '../shared/Card/CardContent';
import firestore from '@react-native-firebase/firestore'; // Thêm Firestore SDK

const CARD_WIDTH = sizes.width / 2 - (spacing.l + spacing.l / 2);
const CARD_HEIGHT = 220;

const TripsList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const tripsList = [];
        const querySnapshot = await firestore().collection('places').get(); 
        querySnapshot.forEach(doc => {
          tripsList.push({ id: doc.id, ...doc.data() });
        });
        setList(tripsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  return (
    <View style={styles.container}>
      {list.map((item) => (
        <Card
          key={item.id}
          style={styles.card}
          onPress={() => {
            navigation.navigate('TripDetails', { trip: item });
          }}
        >
          <SharedElement id={`trip.${item.id}.image`} style={styles.media}>
            <CardMedia source={{ uri: item.imageUrl }} />
          </SharedElement>
          <CardContent style={styles.content}>
            <View style={styles.titleBox}>
              <Text style={styles.title}>{item.title}</Text> 
              <Text style={styles.location}>{item.location}</Text> 
            </View>
            <FavoriteButton />
          </CardContent>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardContainer: {
    marginLeft: spacing.l,
    marginBottom: spacing.l,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginLeft: spacing.l,
    marginBottom: spacing.l,
  },
  media: {
    flex: 1,
  },
  content: {
    paddingRight: spacing.m / 2,
  },
  titleBox: {
    flex: 1,
  },
  title: {
    marginVertical: 4,
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: colors.primary,
  },
  location: {
    fontSize: sizes.body,
    color: colors.lightGray,
  },
});

export default TripsList;
