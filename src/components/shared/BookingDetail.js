import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import {useRoute, useNavigation} from '@react-navigation/native';
import {colors, sizes} from '../../constants/theme';

const BookingDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {bookingId} = route.params;

  const [bookingDetails, setBookingDetails] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [hotelOwnerDetails, setHotelOwnerDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const bookingDoc = await firestore()
          .collection('bookings')
          .doc(bookingId)
          .get();

        if (bookingDoc.exists) {
          const bookingData = {id: bookingDoc.id, ...bookingDoc.data()};
          setBookingDetails(bookingData);

          const hotelDoc = await firestore()
            .collection('hotels')
            .doc(bookingData.hotelId)
            .get();

          if (hotelDoc.exists) {
            const hotelData = {id: hotelDoc.id, ...hotelDoc.data()};
            setHotelDetails(hotelData);

            if (hotelData.partner) {
              const ownerDoc = await firestore()
                .collection('users')
                .doc(hotelData.partner)
                .get();

              if (ownerDoc.exists) {
                const ownerData = {id: ownerDoc.id, ...ownerDoc.data()};
                setHotelOwnerDetails(ownerData);
              }
            }
          }

          const roomDoc = await firestore()
            .collection('rooms')
            .doc(bookingData.roomId)
            .get();

          if (roomDoc.exists) {
            const roomData = {id: roomDoc.id, ...roomDoc.data()};
            setRoomDetails(roomData);
          }
        }
      } catch (error) {
        console.error('Error fetching booking details: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleReviewPress = hotelId => {
    navigation.navigate('ReviewSection', {hotelId});
  };

  const handleChatPress = () => {
    // Thêm hành động chat với nhân viên tại đây
    alert('Chat với nhân viên'); // Thay thế với hành động thực tế của bạn
  };
  const handleCancelBooking = async () => {
    Alert.alert(
      "Xác nhận hủy đặt phòng",
      "Bạn có chắc chắn muốn hủy đặt phòng?",
      [
        {
          text: "Hủy",
          onPress: () => console.log("Hủy hủy bỏ"),
          style: "cancel"
        },
        { text: "Đồng ý", onPress: async () => {
            try {
              await firestore()
                .collection('bookings')
                .doc(bookingDetails.id)
                .update({ status: 'cancelled' });
  
              // Cập nhật lại thông tin đặt phòng để phản ánh trạng thái mới
              setBookingDetails(prev => ({ ...prev, status: 'cancelled' }));
              Alert.alert("Thông báo", "Đặt phòng đã được hủy thành công.");
            } catch (error) {
              console.error('Error canceling booking: ', error);
              Alert.alert("Lỗi", "Có lỗi xảy ra khi hủy đặt phòng. Vui lòng thử lại.");
            }
        } }
      ]
    );
  };
  

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!bookingDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDetails}>
          Không tìm thấy thông tin đặt phòng.
        </Text>
      </View>
    );
  }
  const formatCurrency = amount => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const renderStatus = () => {
    let statusText = '';
    let statusColor = '';
    let statusIcon = '';

    switch (bookingDetails.status) {
      case 'pending':
        statusText = 'Chờ xác nhận';
        statusColor = '#ecb708'; // Màu vàng
        statusIcon = 'clock-o'; // Icon tương ứng
        break;
      case 'confirmed':
        statusText = 'Đã xác nhận';
        statusColor = '#4c8d6e'; // Màu xanh
        statusIcon = 'check-circle'; // Icon tương ứng
        break;
      case 'completed':
        statusText = 'Đã hoàn thành';
        statusColor = '#3b82f6'; // Màu xanh dương
        statusIcon = 'check-circle'; // Icon tương ứng
        break;
      case 'cancelled': // Thêm trường hợp mới cho trạng thái "Đã hủy"
        statusText = 'Đã hủy';
        statusColor = '#d9534f'; // Màu đỏ
        statusIcon = 'times-circle'; // Icon tương ứng
        break;

      default:
        statusText = 'Trạng thái không xác định';
        statusColor = 'grey'; // Màu xám
        statusIcon = 'exclamation-circle'; // Icon tương ứng
        break;
    }

    return (
      <View style={styles.statusContainer}>
        <Icon name={statusIcon} size={20} color={statusColor} />
        <Text style={[styles.cardStatus, {color: statusColor}]}>
          {statusText}
        </Text>
      </View>
    );
  };

  const renderButtons = () => {
    if (bookingDetails.status === 'completed') {
      return (
        <TouchableOpacity
          style={styles.buttonDestructive}
          onPress={() => handleReviewPress(bookingDetails.hotelId)}>
          <Text style={[styles.buttonText, styles.whiteText]}>Đánh giá</Text>
        </TouchableOpacity>
      );
    } else if (bookingDetails.status === 'confirmed') {
      return (
        <TouchableOpacity style={styles.buttonOutline} disabled>
          <Text style={styles.buttonText}>Đánh giá</Text>
        </TouchableOpacity>
      );
    } else if (bookingDetails.status === 'cancelled') {
      return (
        <TouchableOpacity style={styles.buttonOutline} disabled>
          <Text style={styles.buttonText}>Đặt phòng đã bị hủy</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <>
          <TouchableOpacity style={styles.buttonOutline}>
            <Text style={styles.buttonText}>Liên hệ khách sạn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonDestructive} onPress={handleCancelBooking}>
            <Text style={[styles.buttonText, styles.whiteText]}>
              Hủy đặt phòng
            </Text>
          </TouchableOpacity>
        </>
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Khách sạn {hotelDetails ? hotelDetails.title : 'Khách sạn'}
        </Text>
        <Text style={styles.roomTitle}>
          {roomDetails ? roomDetails.roomType : 'Phòng'}{' '}
        </Text>

        <View style={styles.detailRow}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="calendar-check-o"
              size={20}
              color={colors.primary}
              style={{marginRight: 5}}
            />
            <Text style={styles.label}>Ngày nhận phòng:</Text>
          </View>
          <Text style={styles.value}>
            {new Date(bookingDetails.checkInDate).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="calendar-check-o"
              size={20}
              color={colors.primary}
              style={{marginRight: 5}}
            />
            <Text style={styles.label}>Ngày trả phòng:</Text>
          </View>
          <Text style={styles.value}>
            {new Date(bookingDetails.checkOutDate).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="user-o"
              size={20}
              color={colors.primary}
              style={{marginRight: 5}}
            />
            <Text style={styles.label}>Số khách:</Text>
          </View>
          <Text style={styles.value}>{bookingDetails.adults} người</Text>
        </View>

        <View style={styles.detailRow}>
          {bookingDetails.children > 0 && ( // Điều kiện kiểm tra số lượng trẻ con
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="user-plus"
                size={20}
                color={colors.lightGray}
                style={{marginRight: 5}}
              />
              <Text style={styles.label}>Trẻ con:</Text>
            </View>
          )}
          {bookingDetails.children > 0 && ( // Hiển thị số lượng trẻ con chỉ khi lớn hơn 0
            <Text style={styles.value}>{bookingDetails.children} người</Text>
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.TitleContainer}>Trạng thái đặt phòng</Text>
        {renderStatus()}
        <Text style={styles.value}>Mã đặt phòng: {bookingDetails.id}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.TitleContainer}>Tổng thanh toán</Text>
        <Text style={styles.cardTitle}>
          {formatCurrency(bookingDetails.totalPrice)} VND
        </Text>

        <Text style={styles.roomTitle}>Đã bảo gồm thuế và phí</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.TitleContainer}>Thông tin liên hệ</Text>

        <View style={styles.contactRow}>
          <Icon
            name="map-marker"
            size={20}
            color="#A9A9A9"
            style={styles.icon}
          />
          <Text style={styles.value}>
            {hotelDetails ? hotelDetails.address : 'Chưa có địa chỉ'}
          </Text>
        </View>
        <View style={styles.contactRow}>
          <Icon name="envelope" size={15} color="#A9A9A9" style={styles.icon} />
          <Text style={styles.value}>
            {hotelOwnerDetails
              ? hotelOwnerDetails.email
              : 'Chưa có thông tin email'}
          </Text>
        </View>
        <View style={styles.contactRow}>
          <Icon name="phone" size={20} color="#A9A9A9" style={styles.icon} />
          <Text style={styles.value}>
            {hotelOwnerDetails
              ? hotelOwnerDetails.phone
              : 'Chưa có thông tin số điện thoại'}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>{renderButtons()}</View>

      {/* Phần cần hỗ trợ */}
      <View style={styles.supportContainer}>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.supportTitle}>Cần hỗ trợ?</Text>
          <Text style={styles.supportTitle}>19001009</Text>
        </View>
        <TouchableOpacity
          style={styles.supportButton}
          onPress={handleChatPress}>
          <Text style={styles.buttonSupportText}>Chat với nhân viên</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#f7f7f7',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  TitleContainer: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  roomTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 14,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardStatus: {
    fontSize: 16,
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  buttonDestructive: {
    backgroundColor: '#d9534f',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonOutline: {
    borderColor: '#007BFF',
    borderWidth: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  whiteText: {
    color: '#fff',
  },
  noDetails: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  supportContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  supportButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  buttonSupportText: {
    color: colors.light,
    padding: 10,
    fontWeight: 'bold',
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingDetail;
