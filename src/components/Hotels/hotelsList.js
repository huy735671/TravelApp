import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('screen');
const cardWidth = width * 0.45;

const HotelsList = () => {
  const [loading, setLoading] = useState(true);

  const locations = [
    { id: '1', name: 'TP. Hồ Chí Minh', image: 'https://tphcm.dangcongsan.vn/DATA/72/IMAGES/2023/11/tao-da-de-tphcm-phat-trien-thanh-do-thi-thong-minh1517188897.jpg' },
    { id: '2', name: 'Bình Dương', image: 'https://xaydungdang.org.vn/Uploads/hohoanghao/3-5-22%20binh%20duong/a4.jpg' },
    { id: '3', name: 'Phú Yên', image: 'https://dulichyviet.com.vn/wp-content/uploads/2024/02/ban-do-du-lich-phu-yen-21.jpeg' },
    {id: '4', name: 'Thủ Dầu Một', image: 'https://lh4.googleusercontent.com/proxy/kvcsxNsCQ4hMhoxwK90ELtwAjmHQEGUZtrnXbyU-Pm4R5yoXD6TvdDiJLclckcP8kfCYIuzap7gamXAdXZscqIRf3a8uuLxtQlnDHHprFuOdCEKXVsM'},
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  
  const navigation = useNavigation();

  const handleLocationPress = (location) => {
    navigation.navigate('ListHotelDetails', { location }); 
  };

  const LocationCard = ({ location }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleLocationPress(location.name)}
    >
      <Image 
        source={{ uri: location.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <Text style={styles.locationName}>{location.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={locations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <LocationCard location={item} />}
        contentContainerStyle={styles.flatListContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  flatListContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    width: cardWidth,
    elevation: 5,
    borderRadius: 15,
    backgroundColor: colors.white,
    marginHorizontal: 10,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%', // Chiếm toàn bộ chiều cao của thẻ
    borderRadius: 15,
    position: 'absolute', // Đặt hình ảnh ở vị trí tuyệt đối
    top: 0,
    left: 0,
  },
  locationName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white', // Màu chữ để dễ đọc trên hình ảnh
    position: 'absolute', // Đặt chữ ở vị trí tuyệt đối
    bottom: 10, // Đặt chữ ở dưới cùng
    left: 10, // Đặt chữ ở bên trái
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ để chữ dễ đọc hơn
    padding: 5, // Khoảng cách bên trong
    borderRadius: 5, // Bo tròn các góc
  },
});

export default HotelsList;
