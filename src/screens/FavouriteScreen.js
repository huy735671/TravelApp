import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

const FavouriteScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('hotels');
  const navigation = useNavigation();
  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      const userEmail = user.email;

      const unsubscribe = firestore()
        .collection('favorites')
        .doc(userEmail)
        .onSnapshot(async doc => {
          if (doc.exists) {
            const data = doc.data();
            const favoriteIds = Object.keys(data).filter(key => data[key]);

            const favoriteDetailsPromises = favoriteIds.map(async id => {
              const hotelDoc = await firestore()
                .collection('hotels')
                .doc(id)
                .get();
              const placeDoc = await firestore()
                .collection('places')
                .doc(id)
                .get();
              const topPlaceDoc = await firestore()
                .collection('topPlaces')
                .doc(id)
                .get();

              return {
                id,
                data: hotelDoc.exists
                  ? {...hotelDoc.data(), type: 'hotel'}
                  : placeDoc.exists
                  ? {...placeDoc.data(), type: 'place'}
                  : topPlaceDoc.exists
                  ? {...topPlaceDoc.data(), type: 'topPlace'}
                  : null,
              };
            });

            const favoriteDetails = await Promise.all(favoriteDetailsPromises);
            setFavorites(favoriteDetails.filter(item => item.data));
          } else {
            setFavorites([]);
          }
          setLoading(false);
        });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const filteredFavorites = favorites.filter(item => {
    return (
      item.data &&
      item.data.type === (selectedType === 'hotels' ? 'hotel' : 'place')
    );
  });

  const handleDelete = id => {
    const userEmail = auth().currentUser.email;
    firestore()
      .collection('favorites')
      .doc(userEmail)
      .update({
        [id]: false,
      });
  };

  const handleDetails = (id, type) => {
    if (type === 'hotel') {
      navigation.navigate('HotelDetails', {hotelId: id});
    } else if (type === 'place' || type === 'topPlace') {
      navigation.navigate('TripDetails', {trip: id});
    }
  };
  

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh Sách Yêu Thích</Text>
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            selectedType === 'places' && styles.activeSegment,
          ]}
          onPress={() => setSelectedType('places')}>
          <Text style={styles.segmentText}>Địa Điểm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            selectedType === 'hotels' && styles.activeSegment,
          ]}
          onPress={() => setSelectedType('hotels')}>
          <Text style={styles.segmentText}>Khách Sạn</Text>
        </TouchableOpacity>
      </View>
      {filteredFavorites.length > 0 ? (
        <FlatList
          data={filteredFavorites}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.item}>
              <View style={styles.row}>
                {item.data.imageUrl && (
                  <Image
                    source={{uri: item.data.imageUrl}}
                    style={styles.image}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.infoContainer}>
                  <Text style={styles.titleText}>{item.data.title}</Text>
                  <Text style={styles.locationText}>
                    {item.data.location || 'Địa điểm không xác định'}
                  </Text>
                  <Text style={styles.starRatingText}>
                    {item.data.starRating
                      ? `⭐ ${item.data.starRating}`
                      : 'Không có đánh giá'}
                  </Text>
                  
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleDelete(item.id)}>
                      <Text style={styles.buttonText}>Xóa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleDetails(item.id, item.data.type)}>
                      <Text style={styles.buttonText}>Chi tiết</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      ) : (
        <Text>Chưa có chuyến đi yêu thích nào.</Text>
      )}
    </View>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  segmentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  segmentButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  activeSegment: {
    backgroundColor: '#007bff',
  },
  segmentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  item: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationText: {
    fontSize: 14,
    color: '#777',
  },
  starRatingText: {
    fontSize: 14,
    color: '#FFD700', // Màu vàng cho sao
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
