import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import {colors, sizes} from '../../constants/theme';
import firestore from '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from '../shared/Icon';
import {useNavigation} from '@react-navigation/native';
import FavoriteButton from '../shared/FavoriteButton';
import StarRating from '../shared/Rating/Rating';

const ListHotelDetails = ({route}) => {
  const {location} = route.params;
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const snapshot = await firestore()
          .collection('hotels')
          .where('location', '==', location)
          .get();

        const hotelsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHotels(hotelsData);
      } catch (error) {
        console.error('Error fetching hotels: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [location]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const renderHotelItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('HotelDetails', {hotelId: item.id})}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="#4c8d6e"
      />
      <Image source={{uri: item.imageUrl}} style={styles.cardImage} />
      <View style={{flexDirection: 'column', marginHorizontal: 10}}>
        <Text style={styles.hotelName}>{item.hotelName}</Text>
        <StarRating
          showLabelInline
          rating={item.rating}
          size={12}
          containerStyle={styles.rating}
        />
        <Text style={styles.bodyText}>
          Giá một đêm: {item.pricePerNight} VND
        </Text>
        <Text>Đã bao gồm thuế và phí</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Animatable.View
        style={[styles.backButton, {marginTop: insets.top}]}
        animation="fadeIn"
        delay={500}
        duration={400}
        easing="ease-in-out">
        <Icon
          icon="Back"
          style={styles.backIcon}
          size={40}
          onPress={navigation.goBack}
        />
      </Animatable.View>
      
      <View style={{flex: 1, alignItems: 'center', paddingVertical: 10}}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Khách sạn ở {location}</Text>
        </View>
        <FlatList
          data={hotels}
          keyExtractor={item => item.id}
          renderItem={renderHotelItem}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  backButton: {
    backgroundColor: '#4c8d6e',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  headerContainer: {
    paddingVertical: 10,
    width: '80%',
    borderWidth: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  flatListContainer: {
    paddingBottom: 20,
    marginHorizontal: 10,
  },
  card: {
    marginVertical: 10,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: colors.white,
    padding: 10,
    flexDirection: 'row',
  },
  cardImage: {
    height: 150,
    width: '30%',
    borderRadius: 10,
  },
  hotelName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
    color: colors.primary,
  },
  bodyText: {
    fontSize: sizes.h3,
    color: colors.black,
  },
});

export default ListHotelDetails;
