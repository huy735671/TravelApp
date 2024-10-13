import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../shared/Icon';
import { colors, sizes } from '../../constants/theme';

const BookingScreen = ({ route, navigation }) => {
  const { room, checkInDate, checkOutDate } = route.params;
  const [adults, setAdults] = useState(room.capacity);
  const [children, setChildren] = useState(0);
  const [hotelInfo, setHotelInfo] = useState(null);
  const insets = useSafeAreaInsets();

  const calculateTotalPrice = () => {
    const dayCount = calculateTotalDays();
    return dayCount * room.pricePerNight;
  };

  const calculateTotalDays = () => {
    return Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    );
  };

  useEffect(() => {
    const fetchHotelInfo = async () => {
      try {
        const hotelSnapshot = await firestore()
          .collection('hotels')
          .doc(room.hotelId)
          .get();
        if (hotelSnapshot.exists) {
          setHotelInfo(hotelSnapshot.data());
        } else {
          console.log('Hotel not found!');
        }
      } catch (error) {
        console.error('Error fetching hotel info: ', error);
      }
    };

    fetchHotelInfo();
  }, [room.hotelId]);

  const handleBooking = async () => {
    const user = auth().currentUser; // Lấy thông tin người dùng đang đăng nhập
    if (!user) {
      alert('Bạn cần đăng nhập để đặt phòng.');
      return;
    }

    const bookingData = {
      hotelId: room.hotelId,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      adults,
      children,
      checkInDate,
      checkOutDate,
      totalPrice: calculateTotalPrice(),
      bookedBy: {
        uid: user.uid,
        email: user.email,
      },
      status: 'pending', // Trạng thái là 'pending'
    };

    try {
      await firestore().collection('bookings').add(bookingData);
      alert('Đặt phòng thành công!');
      navigation.goBack(); // Quay lại màn hình trước đó
    } catch (error) {
      console.error('Error creating booking: ', error);
      alert('Có lỗi xảy ra trong quá trình đặt phòng.');
    }
  };

  const increaseAdults = () => {
    setAdults((prev) => prev + 1);
  };

  const decreaseAdults = () => {
    if (adults > room.capacity) {
      setAdults((prev) => prev - 1);
    }
  };

  const increaseChildren = () => {
    setChildren((prev) => prev + 1);
  };

  const decreaseChildren = () => {
    if (children > 0) {
      setChildren((prev) => prev - 1);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="#4c8d6e" />
      <Animatable.View
        style={[styles.backButton, { marginTop: insets.top }]}
        animation="fadeIn"
        delay={500}
        duration={400}
        easing="ease-in-out">
        <Icon icon="Back" style={styles.backIcon} size={40} onPress={navigation.goBack} />
      </Animatable.View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          {room.roomType} - {room.view}
        </Text>
        {room.image && <Image source={{ uri: room.image }} style={styles.roomImage} />}
        <View style={styles.bodyContainer}>
          <View style={styles.inputBodyContainer}>
            <View style={styles.inputContainer}>
              <View style={styles.counterContainer}>
                <Text style={styles.label}>Người lớn {'\n'}(18 tuổi trở lên)</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={[styles.roundButton, adults <= room.capacity && styles.disabledButton]}
                    onPress={decreaseAdults}
                    disabled={adults <= room.capacity}>
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterText}>{adults}</Text>
                  <TouchableOpacity style={styles.roundButton} onPress={increaseAdults}>
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.counterContainer}>
                <Text style={styles.label}>Trẻ em{'\n'}(17 tuổi trở xuống)</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={[styles.roundButton, children === 0 && styles.disabledButton]}
                    onPress={decreaseChildren}
                    disabled={children === 0}>
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterText}>{children}</Text>
                  <TouchableOpacity style={styles.roundButton} onPress={increaseChildren}>
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              Ngày nhận phòng{'\n'}
              {new Date(checkInDate).toLocaleDateString('vi-VN')}
            </Text>
            <Text style={styles.dateText}>
              Ngày trả phòng{'\n'}
              {new Date(checkOutDate).toLocaleDateString('vi-VN')}
            </Text>
          </View>

          <TouchableOpacity style={styles.customButton} onPress={handleBooking}>
            <Text style={styles.buttonText}>
              Đặt phòng - {calculateTotalPrice().toLocaleString('vi-VN')} VNĐ / {calculateTotalDays()} đêm
            </Text>
          </TouchableOpacity>
        </View>
        {hotelInfo && (
          <View style={styles.hotelInfoContainer}>
            <Text style={{ fontWeight: 'bold', fontSize: sizes.h2, paddingBottom: 10, color: colors.primary }}>
              Thông tin khách sạn
            </Text>
            <Text style={styles.hotelInfoText}>Tên khách sạn: {hotelInfo.title}</Text>
            <Text style={styles.hotelInfoText}>Địa chỉ: {hotelInfo.address}</Text>
            <Text style={styles.hotelInfoText}>Email: {hotelInfo.partner}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    backButton: {
      backgroundColor: '#4c8d6e',
    },
    scrollContainer: {
      padding: 20,
    },
    title: {
      fontSize: sizes.h2,
      color: colors.primary,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    roomImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 20,
    },
    bodyContainer: {
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      borderColor: '#ddd',
    },
    inputBodyContainer: {
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      borderColor: '#ddd',
    },
    inputContainer: {
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
    },
    counterContainer: {
      paddingHorizontal: 20,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    counterText: {
      marginHorizontal: 10,
      fontSize: 16,
      borderWidth:1,
      padding:5,
      borderRadius:3,
      borderColor:'#ddd',
      backgroundColor:'#e7e7e8',
    },
    dateContainer: {
      paddingTop:10,
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginBottom: 20,
    },
    dateText: {
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      borderColor: '#ddd',
      fontSize: 16,
      marginBottom: 10,
      color: colors.primary,
    },
    customButton: {
      backgroundColor: '#4c8d6e',
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    roundButton: {
      width: 30, // hoặc kích thước mà bạn muốn
      height: 30, // hoặc kích thước mà bạn muốn
      borderRadius: 20, // nửa kích thước để tạo hình tròn
      backgroundColor: '#4c8d6e',
      justifyContent: 'center',
      alignItems: 'center',
    },
    disabledButton: {
      backgroundColor: '#ccc', // Màu cho nút vô hiệu hóa
    },
  
    buttonText: {
      color: colors.light,
      fontSize: sizes.h3,
    },
    hotelInfoContainer: {
      padding: 10,
      alignItems: 'flex-start',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      marginTop: 20,
    },
    hotelInfoText: {
      fontSize: 16,
      marginBottom: 5,
    },
  });

export default BookingScreen;
