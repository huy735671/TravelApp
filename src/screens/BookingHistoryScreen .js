import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
  LayoutAnimation,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {colors, sizes} from '../constants/theme';

const BookingHistoryScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigation = useNavigation();

  useEffect(() => {
    const user = auth().currentUser;

    if (user) {
      const email = user.email;

      const unsubscribe = firestore()
        .collection('bookings')
        .where('bookedBy.email', '==', email)
        .onSnapshot(
          async bookingsSnapshot => {
            const fetchedBookings = await Promise.all(
              bookingsSnapshot.docs.map(async doc => {
                const bookingData = {id: doc.id, ...doc.data()};

                // Lấy tên khách sạn
                const hotelDoc = await firestore()
                  .collection('hotels')
                  .doc(bookingData.hotelId)
                  .get();
                bookingData.hotelName = hotelDoc.exists
                  ? hotelDoc.data().title
                  : 'Không xác định';

                // Lấy hình ảnh phòng từ bảng rooms
                const roomDoc = await firestore()
                  .collection('rooms')
                  .doc(bookingData.roomId)
                  .get();
                bookingData.roomImage = roomDoc.exists
                  ? roomDoc.data().image
                  : null;

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

  const handleDetailPress = bookingId => {
    navigation.navigate('BookingDetail', {bookingId});
  };

  const handleFilterChange = (newFilter) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilter(newFilter);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && styles.activeFilterButton,
          ]}
          onPress={() => handleFilterChange('all')}>
          <Text style={filter === 'all' ? styles.activeFilterText : styles.filterText}>
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'pending' && styles.activeFilterButton,
          ]}
          onPress={() => handleFilterChange('pending')}>
          <Text style={filter === 'pending' ? styles.activeFilterText : styles.filterText}>
            Chờ xác nhận
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'confirmed' && styles.activeFilterButton,
          ]}
          onPress={() => handleFilterChange('confirmed')}>
          <Text style={filter === 'confirmed' ? styles.activeFilterText : styles.filterText}>
            Đã xác nhận
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'completed' && styles.activeFilterButton,
          ]}
          onPress={() => handleFilterChange('completed')}>
          <Text style={filter === 'completed' ? styles.activeFilterText : styles.filterText}>
            Hoàn thành
          </Text>
        </TouchableOpacity>
      </View>

      {filteredBookings.length > 0 ? (
        <ScrollView
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}>
          {filteredBookings.map(booking => {
            return (
              <TouchableOpacity
                key={booking.id}
                style={styles.bookingItem}
                onPress={() => handleDetailPress(booking.id)}>
                <View style={styles.bookingDetails}>
                  <Image
                    source={{uri: booking.roomImage}}
                    style={styles.roomImage}
                  />
                  <View style={styles.infoContainer}>
                    <Text style={styles.hotelName}>
                      Khách sạn: {booking.hotelName}
                    </Text>
                    <Text style={styles.bookingDates}>
                      {new Date(booking.checkInDate).toLocaleDateString(
                        'vi-VN',
                        {day: 'numeric', month: 'numeric', year: 'numeric'},
                      )}{' '}
                      -
                      {new Date(booking.checkOutDate).toLocaleDateString(
                        'vi-VN',
                        {day: 'numeric', month: 'numeric', year: 'numeric'},
                      )}
                    </Text>
                    <Text
                      style={[
                        styles.statusText,
                        booking.status === 'confirmed'
                          ? styles.confirmed
                          : booking.status === 'completed'
                          ? styles.completed
                          : booking.status === 'pending'
                          ? styles.pending
                          : null,
                      ]}>
                      {booking.status === 'confirmed'
                        ? 'Sắp tới'
                        : booking.status === 'completed'
                        ? 'Đã hoàn thành'
                        : 'Đang chờ xác nhận'}
                    </Text>
                  </View>
                  <Icon name="arrow-forward" size={24} color="#000" />
                </View>
              </TouchableOpacity>
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
    padding: 10,
    backgroundColor: '#ffffff',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderRadius: 5,
    backgroundColor:'#e7e7e8',
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    borderColor: colors.primary,
    marginVertical:3,

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  bookingDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roomImage: {
    width: 90,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  hotelName: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  bookingDates: {
    fontSize: 16,
    color: '#555',
  },
  statusText: {
    marginTop: 4,
    fontSize: 16,
    fontWeight:'bold',
  },
  noBookings: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
  confirmed: {
    color: '#4c8d6e', // Màu cho 'Sắp tới'
  },
  completed: {
    color: '#3b82f6', // Màu cho 'Đã hoàn thành'
  },
  pending: {
    color: '#ecb708', // Màu cho 'Đang chờ xác nhận'
  },
});


export default BookingHistoryScreen;
