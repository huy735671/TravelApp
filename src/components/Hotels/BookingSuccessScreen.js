import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  BackHandler,
} from 'react-native';
import {colors, sizes} from '../../constants/theme';
import firestore from '@react-native-firebase/firestore';

const BookingSuccessScreen = ({navigation, route}) => {
  const {room, checkInDate, checkOutDate, totalPrice, hotelId} = route.params;

  const [hotelInfo, setHotelInfo] = useState({
    name: '',
    address: '',
    image: '',
  });

  useEffect(() => {
    const fetchHotelInfo = async () => {
      try {
        const hotelDoc = await firestore()
          .collection('hotels')
          .doc(hotelId)
          .get();
        if (hotelDoc.exists) {
          const data = hotelDoc.data();
          setHotelInfo({
            name: data.title,
            address: data.address,
            image: data.imageUrl, 
          });
        }
      } catch (error) {
        console.error('Error fetching hotel info: ', error);
      }
    };

    fetchHotelInfo();
  }, [hotelId]);

  useEffect(() => {
    const onBackPress = () => {
      return true; // Chặn hành động quay lại
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);
  // Hàm chuyển đổi định dạng ngày
  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <Image
        source={require('../../../assets/images/booking.png')}
        style={styles.bookingImage}
      />
      <Text style={styles.title}>Đặt phòng thành công!</Text>
      <Text style={styles.message}>
        Cảm ơn bạn đã đặt phòng. Dưới đây là thông tin đặt phòng của bạn:
      </Text>
      <View style={styles.roomInfoContainer}>
        <Text style={styles.roomInfoTitle}>Phòng:</Text>
        <Text style={styles.roomInfoValue}>{room.roomType}</Text>
      </View>
      <View style={styles.roomInfoContainer}>
        <Text style={styles.roomInfoTitle}>Ngày nhận phòng:</Text>
        <Text style={styles.roomInfoValue}>{formatDate(checkInDate)}</Text>
      </View>
      <View style={styles.roomInfoContainer}>
        <Text style={styles.roomInfoTitle}>Ngày trả phòng:</Text>
        <Text style={styles.roomInfoValue}>{formatDate(checkOutDate)}</Text>
      </View>
      <View style={styles.roomInfoContainer}>
        <Text style={styles.roomInfoTitle}>Tổng thanh toán:</Text>
        <Text style={styles.roomInfoValue}>
          {totalPrice.toLocaleString('vi-VN')} VNĐ
        </Text>
      </View>
      <View style={{borderTopWidth: 1,width:'100%', borderColor:'#ddd'}}>
        <Text style={{fontWeight: 'bold', fontSize: sizes.h3, marginTop: 10}}>
          Chi tiết đặt phòng
        </Text>
      </View>
      <View style={styles.hotelContainer}>
        {hotelInfo.image ? (
          <Image source={{uri: hotelInfo.image}} style={styles.hotelImage} />
        ) : (
          <Image
            source={require('../../../assets/images/hotels/granada-1.jpeg')}
            style={styles.hotelImage}
          />
        )}
        <View style={styles.hotelInfo}>
          <Text style={styles.hotelName}>{hotelInfo.name}</Text>
          <Text style={styles.hotelAddress}>{hotelInfo.address}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.light,
  },
  bookingImage: {
    width: 300,
    height: 300,
  },
  hotelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    width: '100%', // Chiếm 100% chiều rộng
    paddingHorizontal: 20,
    borderWidth: 1,
    padding: 10,
    borderColor: '#ddd',
    borderRadius: sizes.radius,
    backgroundColor: colors.light,
  },
  hotelImage: {
    width: 60, // Giảm kích thước hình ảnh khách sạn
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  hotelInfo: {
    flex: 1,
  },
  hotelName: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  hotelAddress: {
    fontSize: sizes.h3,
    color: colors.gray,
  },
  title: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  message: {
    fontSize: sizes.h3,
    textAlign: 'center',
    marginBottom: 20,
  },
  roomInfo: {
    fontSize: sizes.h3,
    marginBottom: 5,
    flexDirection: 'row',
  },
  button: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: colors.green,
    borderRadius: sizes.radius,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: sizes.h3,
  },
  roomInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },

  roomInfoTitle: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
  },

  roomInfoValue: {
    fontSize: sizes.h3,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default BookingSuccessScreen;
