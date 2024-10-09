import React from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('screen');
const cardWidth = width * 0.5; // Chiều rộng card được điều chỉnh theo màn hình

const LocationsScreen = () => {
  const navigation = useNavigation();

  const stayType = [
    {
      id: '1',
      name: 'Khách sạn ',
      type: 'business',
      image:
        'https://r-xx.bstatic.com/xdata/images/xphoto/263x210/57584488.jpeg?k=d8d4706fc72ee789d870eb6b05c0e546fd4ad85d72a3af3e30fb80ca72f0ba57&o=',
    },
    {
      id: '2',
      name: 'Căn hộ ',
      type: 'apartment',
      image:
        'https://q-xx.bstatic.com/xdata/images/hotel/263x210/119467716.jpeg?k=f3c2c6271ab71513e044e48dfde378fcd6bb80cb893e39b9b78b33a60c0131c9&o=',
    },
    {
      id: '3',
      name: 'Resort ',
      type: 'resort',
      image:
        'https://r-xx.bstatic.com/xdata/images/xphoto/263x210/45450084.jpeg?k=f8c2954e867a1dd4b479909c49528531dcfb676d8fbc0d60f51d7b51bb32d1d9&o=',
    },
    {
      id: '4',
      name: 'Biệt thự ',
      type: 'Villa',
      image:
        'https://r-xx.bstatic.com/xdata/images/hotel/263x210/100235855.jpeg?k=5b6e6cff16cfd290e953768d63ee15f633b56348238a705c45759aa3a81ba82b&o=',
    },
  ];

  const LocationCard = ({hotelType}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('HotelListType', { hotelType: hotelType.type })} 
>
      <Image
        source={{uri: hotelType.image}}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <Text style={styles.locationName}>{hotelType.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={stayType}
        keyExtractor={item => item.id}
        renderItem={({item}) => <LocationCard hotelType={item} />}
        contentContainerStyle={styles.stayTypeList}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  
  stayTypeList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    width: cardWidth,
    marginHorizontal: 10,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 5,
    textAlign: 'left', // Căn chữ sang trái
  },
});

export default LocationsScreen;
