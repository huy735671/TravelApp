import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {spacing, sizes, colors} from '../../constants/theme';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {SharedElement} from 'react-navigation-shared-element';
import Card from '../shared/Card/card';
import CardMedia from '../shared/Card/CardMedia';
import CardFavoriteIcon from '../shared/Card/CardFavoriteIcon';
import CardContent from '../shared/Card/CardContent';
import firestore from '@react-native-firebase/firestore';

const SearchCard = ({item, index}) => {
  const navigation = useNavigation();
  const even = index % 2 === 0;

  const imageSource = item.type === 'places' ? item.image : item.imageUrl || 'https://via.placeholder.com/150';

  const handleDetails = async () => {
    try {
  
      // Kiểm tra trong places trước, nếu không có thì kiểm tra hotels
      let collectionName = 'places';
      let doc = await firestore().collection(collectionName).doc(item.id).get();
  
      // Nếu không tìm thấy trong places, kiểm tra hotels
      if (!doc.exists) {
        collectionName = 'hotels';
        doc = await firestore().collection(collectionName).doc(item.id).get();
      }
  
      if (doc.exists) {
        const tripData = { id: doc.id, ...doc.data() };
        if (collectionName === 'hotels') {
          navigation.navigate('HotelDetails', { hotelId: item.id, hotelData: tripData });
        } else {
          navigation.navigate('TripDetails', { trip: tripData });
        }
      } else {
        console.error('Document not found in both collections!');
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  };
  
  
  
  

  return (
    <Animated.View
      entering={FadeInDown.delay(index < 6 ? index * 80 : 0)}
      style={{
        paddingTop: index === 1 ? spacing.l : 0,
        paddingLeft: !even ? spacing.l / 2 : 0,
        paddingRight: even ? spacing.l / 2 : 0,
        paddingBottom: spacing.l,
      }}>
      <Card
        onPress={handleDetails}  // Gọi hàm handleDetails khi nhấn vào Card
        style={{
          width: '100%',
          height: index % 3 === 0 ? 180 : 240,
        }}>
        <CardFavoriteIcon onPress={() => {}} />
        <SharedElement id={`trip.${item.id}.image`} style={styles.media}>
          <CardMedia source={{ uri: imageSource }} borderBottomRadius />
        </SharedElement>
        <CardContent>
          <View style={styles.titleBox}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title || 'Tiêu đề không có'}
            </Text>
            <Text style={styles.location}>
              {item.location || 'Vị trí không có'}
            </Text>
          </View>
        </CardContent>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  media: {
    flex: 1,
  },
  titleBox: {
    flex: 1,
  },
  title: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 4,
  },
  location: {
    fontSize: sizes.body,
    color: colors.lightGray,
  },
});

export default SearchCard;
