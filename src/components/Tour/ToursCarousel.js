import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { colors } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

const ToursCarousel = ({ location }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const snapshot = await firestore()
          .collection('tours')
          .where('location', '==', location)
          .get();

        const toursData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTours(toursData);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [location]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const formatPrice = (price) => {
    if (price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ/người';
    }
    return '0đ/người';
  };

  const renderTourItem = ({ item }) => {
    const defaultImage = 'https://sigo.vn/uploads/9/du-lieu-web/blog/sigo-cong-ty-tour-du-lich-1.jpg';
    const imageSource = item.images && item.images.length > 0 ? item.images[0] : defaultImage;

    const handleDetailsPress = () => {
      navigation.navigate('TourDetail', { tourId: item.id });
    };

    return (
      <View style={styles.tourItem}>
        <Image source={{ uri: imageSource }} style={styles.image} />
        
        <View style={styles.detailsContainer}>
          <Text style={styles.tourName}>{item.name}</Text>
          <View style={styles.priceAndButtonContainer}>
            <Text style={styles.tourPrice}>{formatPrice(item.price)}</Text>
            <TouchableOpacity style={styles.detailsButton} onPress={handleDetailsPress}>
              <Text style={styles.detailsButtonText}>Xem chi tiết</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={tours}
        keyExtractor={item => item.id}
        renderItem={renderTourItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: 10,
  },
  tourItem: {
    padding: 10,
    flexDirection: 'row',
    width: 400,
    marginRight: 15,
    backgroundColor: colors.light,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 5,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  detailsContainer: {
    marginLeft: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  priceAndButtonContainer: {
    alignItems: 'flex-end',
  },
  tourName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tourPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  detailsButton: {
    marginTop: 5,
    padding: 8,
    backgroundColor: colors.green,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ToursCarousel;
