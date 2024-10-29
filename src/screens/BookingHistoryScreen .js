import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, sizes } from '../constants/theme';

const BookingHistoryScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'Tất cả' },
    { key: 'pending', title: 'Chờ xác nhận' },
    { key: 'confirmed', title: 'Đã xác nhận' },
    { key: 'completed', title: 'Hoàn thành' },
    { key: 'cancelled', title: 'Đã hủy' },
  ]);
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
                const bookingData = { id: doc.id, ...doc.data() };

                const hotelDoc = await firestore()
                  .collection('hotels')
                  .doc(bookingData.hotelId)
                  .get();
                bookingData.hotelName = hotelDoc.exists
                  ? hotelDoc.data().title
                  : 'Không xác định';

                const roomDoc = await firestore()
                  .collection('rooms')
                  .doc(bookingData.roomId)
                  .get();
                bookingData.roomImage = roomDoc.exists
                  ? roomDoc.data().image
                  : null;

                return bookingData;
              })
            );

            setBookings(fetchedBookings);
            setLoading(false);
          },
          error => {
            console.error('Error fetching bookings: ', error);
            setLoading(false);
          }
        );

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const renderScene = ({ route }) => {
    const filteredBookings = bookings.filter(booking => {
      if (route.key === 'all') return true;
      return booking.status === route.key;
    });

    if (filteredBookings.length === 0) {
      return <Text style={styles.noBookings}>Không có lịch đặt nào</Text>;
    }

    return (
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredBookings.map(booking => (
          <TouchableOpacity
            key={booking.id}
            style={styles.bookingItem}
            onPress={() => navigation.navigate('BookingDetail', { bookingId: booking.id })}>
            <View style={styles.bookingDetails}>
              <Image 
                source={{ uri: booking.roomImage || 'fallback_image_url' }} 
                style={styles.roomImage} 
              />
              <View style={styles.infoContainer}>
                <Text style={styles.hotelName}>Khách sạn: {booking.hotelName}</Text>
                <Text style={styles.bookingDates}>
                  {new Date(booking.checkInDate).toLocaleDateString('vi-VN', {
                    day: 'numeric', month: 'numeric', year: 'numeric'
                  })} - {new Date(booking.checkOutDate).toLocaleDateString('vi-VN', {
                    day: 'numeric', month: 'numeric', year: 'numeric'
                  })}
                </Text>
                <Text style={[
                  styles.statusText,
                  booking.status === 'confirmed' ? styles.confirmed
                  : booking.status === 'completed' ? styles.completed
                  : booking.status === 'pending' ? styles.pending
                  : booking.status === 'cancelled' ? styles.cancelled : null,
                ]}>
                  {booking.status === 'confirmed' ? 'Sắp tới' :
                   booking.status === 'completed' ? 'Đã hoàn thành' :
                   booking.status === 'cancelled' ? 'Đã hủy' : 'Đang chờ xác nhận'}
                </Text>
              </View>
              <Icon name="arrow-forward" size={24} color="#000" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{ backgroundColor: 'white' }}
      labelStyle={{ color: colors.primary, fontWeight: 'bold' }}
    />
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: sizes.width }}
      renderTabBar={renderTabBar}
      scrollEnabled
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  noBookings: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
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
    shadowOffset: { width: 0, height: 2 },
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
    fontWeight: 'bold',
  },
  confirmed: { color: '#4c8d6e' },
  completed: { color: '#3b82f6' },
  pending: { color: '#ecb708' },
  cancelled: { color: '#ff4d4f' },
});

export default BookingHistoryScreen;
