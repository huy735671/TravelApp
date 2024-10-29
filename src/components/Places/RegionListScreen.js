import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable';
import Icon from '../shared/Icon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import {spacing, sizes, colors} from '../../constants/theme';

const RegionListScreen = ({route}) => {
  const {title} = route.params; // Nhận title từ route params
  const [places, setPlaces] = useState([]);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPlaces = async () => {
      const snapshot = await firestore()
        .collection('places')
        .where('location', '==', title)
        .get();

      const placesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPlaces(placesData);
    };

    fetchPlaces();
  }, [title]);

  const renderPlace = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.placeContainer}
        onPress={() => navigation.navigate('TripDetails', {trip: item})}>
        <Image source={{uri: item.imageUrl}} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.placeTitle}>
            {item.title || 'Tiêu đề không có'}
          </Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.starRating}>{item.starRating}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.headerTitle}>Các địa điểm du lịch tại {title}</Text> */}

      <FlatList
        data={places}
        renderItem={renderPlace}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },

  placeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  placeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    color: '#555',
  },
  starRating: {
    fontSize: 16,
    color: '#FFD700',
  },
});

export default RegionListScreen;
