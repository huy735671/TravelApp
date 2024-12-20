import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, BackHandler, SafeAreaView } from 'react-native';
import { colors, sizes } from '../../constants/theme';
import firestore from '@react-native-firebase/firestore';

const BookingSuccessScreen = ({navigation, route}) => {
  const { bookingId } = route.params; // Lấy bookingId từ params
  const [bookingInfo, setBookingInfo] = useState(null);
  const [hotelInfo, setHotelInfo] = useState({
    name: '',
    address: '',
    image: '',
  });

  // Lấy thông tin booking từ Firestore
  useEffect(() => {
    const fetchBookingInfo = async () => {
      try {
        const bookingDoc = await firestore()
          .collection('bookings')
          .doc(bookingId) // Dùng bookingId để lấy thông tin booking
          .get();
        if (bookingDoc.exists) {
          const data = bookingDoc.data();
          setBookingInfo(data); // Lưu thông tin booking vào state
          fetchHotelInfo(data.hotelId); // Sau khi lấy thông tin booking, gọi hàm lấy thông tin khách sạn
        }
      } catch (error) {
        console.error('Error fetching booking info: ', error);
      }
    };

    const fetchHotelInfo = async (hotelId) => {
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

    if (bookingId) {
      fetchBookingInfo();
    }
  }, [bookingId]);

  // Hàm chuyển đổi định dạng ngày
  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const onBackPress = () => {
      return true; // Chặn hành động quay lại
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  if (!bookingInfo) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.roomInfoValue}>{bookingInfo.roomType}</Text>
      </View>
      <View style={styles.roomInfoContainer}>
        <Text style={styles.roomInfoTitle}>Ngày nhận phòng:</Text>
        <Text style={styles.roomInfoValue}>{formatDate(bookingInfo.checkInDate)}</Text>
      </View>
      <View style={styles.roomInfoContainer}>
        <Text style={styles.roomInfoTitle}>Ngày trả phòng:</Text>
        <Text style={styles.roomInfoValue}>{formatDate(bookingInfo.checkOutDate)}</Text>
      </View>
      <View style={styles.roomInfoContainer}>
        <Text style={styles.roomInfoTitle}>Tổng thanh toán:</Text>
        <Text style={styles.roomInfoValue}>
          {bookingInfo.totalPrice.toLocaleString('vi-VN')} VNĐ
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
    </SafeAreaView>
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
    width: 200,
    height: 200,
  },
  hotelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
    paddingHorizontal: 20,
    borderWidth: 1,
    padding: 10,
    borderColor: '#ddd',
    borderRadius: sizes.radius,
    backgroundColor: colors.light,
  },
  hotelImage: {
    width: 60,
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
    textAlign: 'center',
  },
  message: {
    fontSize: sizes.h3,
    textAlign: 'center',
    marginBottom: 20,
  },
  roomInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});

export default BookingSuccessScreen;
