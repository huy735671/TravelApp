import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import biểu tượng
import {useNavigation} from '@react-navigation/native'; // Import useNavigation hook
import {colors, sizes} from '../constants/theme';

const BookingHistoryScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // Trạng thái filter, mặc định là 'all'
  const navigation = useNavigation(); // Sử dụng navigation

  useEffect(() => {
    const user = auth().currentUser;

    if (user) {
      const email = user.email;
      console.log('Current user email:', email);

      const unsubscribe = firestore()
        .collection('bookings')
        .where('bookedBy.email', '==', email) 
        .onSnapshot(
          async bookingsSnapshot => {
            const fetchedBookings = await Promise.all(
              bookingsSnapshot.docs.map(async doc => {
                const bookingData = {id: doc.id, ...doc.data()};

                // Lấy tên khách sạn từ hotelId
                const hotelDoc = await firestore()
                  .collection('hotels')
                  .doc(bookingData.hotelId)
                  .get();
                bookingData.hotelName = hotelDoc.exists
                  ? hotelDoc.data().title
                  : 'Không xác định'; // Hoặc tên mặc định

                return bookingData;
              }),
            );

            setBookings(fetchedBookings);
            setLoading(false); 
          },
          error => {
            console.error('Error fetching bookings: ', error);
            setLoading(false); 
          },
        );

      return () => unsubscribe();
    } else {
      console.log('User not logged in');
      setLoading(false);
    }
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const handleReviewPress = (hotelId) => {
    navigation.navigate('ReviewSection', { hotelId }); // Điều hướng và truyền hotelId
  };

  return (
    <View style={styles.container}>
      {/* Bộ lọc */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilterButton]}
          onPress={() => setFilter('all')}>
          <Text style={filter === 'all' ? styles.activeFilterText : styles.filterText}>
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'pending' && styles.activeFilterButton]}
          onPress={() => setFilter('pending')}>
          <Text style={filter === 'pending' ? styles.activeFilterText : styles.filterText}>
            Chờ xác nhận
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'confirmed' && styles.activeFilterButton]}
          onPress={() => setFilter('confirmed')}>
          <Text style={filter === 'confirmed' ? styles.activeFilterText : styles.filterText}>
            Đã xác nhận
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.activeFilterButton]}
          onPress={() => setFilter('completed')}>
          <Text style={filter === 'completed' ? styles.activeFilterText : styles.filterText}>
            Hoàn thành
          </Text>
        </TouchableOpacity>
      </View>

      {filteredBookings.length > 0 ? (
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          {filteredBookings.map(booking => {
            return (
              <View key={booking.id} style={styles.bookingItem}>
                <Text style={styles.hotelName}>Khách sạn: {booking.hotelName}</Text>
                <Text style={styles.statusText}>
                  {booking.status === 'confirmed' && (
                    <Text style={styles.confirmedText}>Sắp tới</Text>
                  )}
                  {booking.status === 'completed' && (
                    <Text style={styles.completedText}>Đã hoàn thành</Text>
                  )}
                </Text>
                <View style={styles.bookingTextContainer}>
                  <Icon name="bed" size={24} color="#000" />
                  <Text style={styles.bookingText}>{booking.roomType}</Text>
                </View>
                <View style={styles.bookingTextContainer}>
                  <Icon name="calendar-month" size={24} color="#000" />
                  <Text style={styles.bookingText}>
                    {new Date(booking.checkInDate).toLocaleDateString('vi-VN', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    -{' '}
                    {new Date(booking.checkOutDate).toLocaleDateString('vi-VN', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={styles.bookingTextContainer}>
                  <Icon name="person-outline" size={24} color="#000" />
                  <Text style={styles.bookingText}>{booking.adults} người</Text>
                </View>
                <View style={styles.bookingTextContainer}>
                  <Icon name="child-care" size={24} color="#000" />
                  <Text style={styles.bookingText}>{booking.children} trẻ em</Text>
                </View>
                <View style={styles.bookingTextContainer}>
                  <Icon name="check-circle-outline" size={24} color="#000" />
                  <Text style={styles.bookingText}>
                    {booking.status === 'pending' && 'Đang chờ xác nhận'}
                    {booking.status === 'confirmed' && 'Đã xác nhận'}
                    {booking.status === 'completed' && 'Đã hoàn thành'}
                  </Text>
                </View>
                <View style={styles.bookingPriceContainer}>
                  <Text style={styles.priceText}>{booking.totalPrice.toLocaleString()} VNĐ</Text>
                  <View style={styles.buttonContainer}>
                    {booking.status === 'pending' && (
                      <TouchableOpacity style={styles.cancelButton}>
                        <Text style={{color: colors.primary}}>Hủy phòng</Text>
                      </TouchableOpacity>
                    )}
                    {booking.status === 'completed' && (
                      <TouchableOpacity
                        style={styles.rateButton}
                        onPress={() => handleReviewPress(booking.hotelId)}>
                        <Text style={{color: colors.primary}}>⭐ Đánh giá</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.detailButton}>
                      <Text style={styles.buttonText}>Chi tiết</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <Text style={styles.noBookings}>Chưa có đơn đặt phòng nào</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  activeFilterButton: {
    backgroundColor: colors.green,
  },
  filterText: {
    color: colors.primary,
  },
  activeFilterText: {
    color: '#fff',
  },
  bookingItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  hotelName: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.primary,
  },
  statusText: {
    marginBottom: 8, // Thêm khoảng cách giữa tên khách sạn và trạng thái
  },
  confirmedText: {
    color: 'green', // Màu chữ cho trạng thái đã xác nhận
  },
  completedText: {
    color: 'blue', // Màu chữ cho trạng thái hoàn thành
  },
  bookingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingText: {
    fontSize: 16,
    marginLeft: 8,
  },
  bookingPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    color: colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  cancelButton: {
    marginLeft: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
  },
  rateButton: {
    marginLeft: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
  },
  detailButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#4c8d6e',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
  },
  noBookings: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
});

export default BookingHistoryScreen;
