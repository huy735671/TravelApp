import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import * as Animatable from 'react-native-animatable';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from '../shared/Icon';
import {colors, shadow, sizes} from '../../constants/theme';
import Divider from '../shared/Divider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const BookingScreen = ({route, navigation}) => {
  const {room, checkInDate, checkOutDate} = route.params;
  const [adults, setAdults] = useState(room.capacity);
  const [children, setChildren] = useState(0);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [userDiscounts, setUserDiscounts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [discountValue, setDiscountValue] = useState(0);

  const insets = useSafeAreaInsets();

  const calculateTotalPrice = () => {
    const dayCount = calculateTotalDays();
    return dayCount * room.pricePerNight;
  };

  const calculateDiscountedPrice = () => {
    const basePrice = calculateTotalPrice();
    return basePrice - (basePrice * discountValue) / 100;
  };

  const calculateTotalDays = () => {
    return Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24),
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
    const user = auth().currentUser;
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
      totalPrice: calculateDiscountedPrice(), // Lưu giá sau giảm giá
      bookedBy: {
        uid: user.uid,
        email: user.email,
      },
      discountId: selectedDiscount ? selectedDiscount.discountId : null, // Cập nhật discountId nếu có
      status: 'pending',
    };
  
    try {
      // Thêm đặt phòng
      await firestore().collection('bookings').add(bookingData);
  
      // Cập nhật mã giảm giá nếu có
      if (selectedDiscount) {
        const discountRef = firestore().collection('discounts').doc(selectedDiscount.discountId);
        const discountDoc = await discountRef.get();
        
        if (discountDoc.exists) {
          const discountData = discountDoc.data();
          const newMaxUsage = discountData.maxUsage - 1;
  
          // Cập nhật maxUsage
          await discountRef.update({ maxUsage: newMaxUsage });
  
          // Kiểm tra xem maxUsage có bằng 0 không
          if (newMaxUsage <= 0) {
            // Xóa mã giảm giá khỏi bảng discounts
            await discountRef.delete();
          }
        }
      }
  
      alert('Đặt phòng thành công!');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating booking: ', error);
      alert('Có lỗi xảy ra trong quá trình đặt phòng.');
    }
  };
  

  const increaseAdults = () => {
    setAdults(prev => Number(prev) + 1);
  };

  const decreaseAdults = () => {
    if (adults > room.capacity) {
      setAdults(prev => Number(prev) - 1);
    }
  };

  const increaseChildren = () => {
    setChildren(prev => prev + 1);
  };

  const decreaseChildren = () => {
    if (children > 0) {
      setChildren(prev => prev - 1);
    }
  };

  const fetchUserDiscounts = async () => {
    const user = auth().currentUser;
    if (!user) {
      alert('Bạn cần đăng nhập để xem mã giảm giá.');
      return;
    }

    try {
      const discountsSnapshot = await firestore()
        .collection('userDiscounts')
        .where('userId', '==', user.email)
        .where('usedBy', '==', false) // Lọc chỉ lấy mã chưa sử dụng
        .get();

      const discounts = await Promise.all(
        discountsSnapshot.docs.map(async doc => {
          const discountData = doc.data();
          const discountSnapshot = await firestore()
            .collection('discounts')
            .doc(discountData.discountId)
            .get();
          const discountInfo = discountSnapshot.data();
          return {
            id: doc.id,
            discountId: discountData.discountId,
            code: discountInfo.code,
            discount: discountInfo.discount,
          };
        }),
      );

      setUserDiscounts(discounts);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching user discounts: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <Animatable.View
        style={[styles.backButton, {marginTop: insets.top}]}
        animation="fadeIn"
        delay={500}
        duration={400}
        easing="ease-in-out">
        <Icon icon="Back" style={styles.backIcon} onPress={navigation.goBack} />
      </Animatable.View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <Text style={styles.title}></Text> */}
        {room.image && (
          <Image source={{uri: room.image}} style={styles.roomImage} />
        )}
        <View style={{padding: 10}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: sizes.title,
              color: colors.primary,
            }}>
            {room.roomType}
          </Text>
          <Text style={{fontSize: sizes.h3}}>
            Phòng sang trọng với view {room.view}
          </Text>
        </View>

        <View style={styles.bodyContainer}>
          <View style={styles.inputBodyContainer}>
            <View style={styles.guestsContainer}>
              <Text style={styles.guestLabel}>Người lớn:</Text>
              <View style={styles.guestControls}>
                <TouchableOpacity onPress={decreaseAdults}>
                  <Text style={styles.guestControl}>-</Text>
                </TouchableOpacity>
                <Text style={styles.guestCount}>{adults}</Text>
                <TouchableOpacity onPress={increaseAdults}>
                  <Text style={styles.guestControl}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Divider />
            <View style={styles.guestsContainer}>
              <Text style={styles.guestLabel}>Trẻ em:</Text>
              <View style={styles.guestControls}>
                <TouchableOpacity onPress={decreaseChildren}>
                  <Text style={styles.guestControl}>-</Text>
                </TouchableOpacity>
                <Text style={styles.guestCount}>{children}</Text>
                <TouchableOpacity onPress={increaseChildren}>
                  <Text style={styles.guestControl}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.guestsContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcons
                  name="calendar-today"
                  size={20}
                  color={colors.primary}
                  style={{marginRight: 5}}
                />

                <Text style={styles.guestLabel}>Số đêm:</Text>
              </View>
              <View style={styles.guestControls}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: colors.primary,
                  }}>
                  {calculateTotalDays()} đêm
                </Text>
              </View>
            </View>

            <View style={styles.discountContainer}>
              <TouchableOpacity onPress={fetchUserDiscounts}>
                {selectedDiscount ? (
                  <Text style={styles.discountText}>
                    Đã áp dụng mã {selectedDiscount.code} giảm {discountValue}%
                  </Text>
                ) : (
                  <View
                    style={{
                      borderWidth: 1,
                      padding: 15,
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <MaterialIcons
                      name="airplane-ticket"
                      size={30}
                      color={colors.primary}
                      style={{marginRight: 5}}
                    />
                    <Text style={styles.discountText}>Mã giảm giá</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.priceContainer}>
              <View style={styles.priceWrapper}>
                {selectedDiscount ? (
                  <>
                    <View style={styles.priceRow}>
                      <Text style={styles.originalPriceLabel}>Giá gốc</Text>
                      <Text style={styles.originalPrice}>
                        {calculateTotalPrice().toLocaleString('vi-VN')} VNĐ
                      </Text>
                    </View>

                    <View style={styles.priceRow}>
                      <Text style={styles.discountedPriceLabel}>
                        Giá sau giảm
                      </Text>
                      <Text style={styles.discountedPrice}>
                        {calculateDiscountedPrice().toLocaleString('vi-VN')} VNĐ
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.priceRow}>
                    <Text style={styles.originalPriceLabel}>Giá gốc</Text>
                    <Text style={styles.firstPrice}>
                      {calculateTotalPrice().toLocaleString('vi-VN')} VNĐ
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.customButton}
                onPress={handleBooking}>
                <Text style={styles.buttonText}>Đặt phòng</Text>
              </TouchableOpacity>
            </View>
          </View>
          {hotelInfo && (
            <View style={styles.hotelInfoContainer}>
              <Text style={styles.hotelInfoTitle}>Thông tin khách sạn</Text>
              <Text style={styles.hotelInfoText}>
                Tên khách sạn: {hotelInfo.title}
              </Text>
              <Text style={styles.hotelInfoText}>
                Địa chỉ: {hotelInfo.address}
              </Text>
              <Text style={styles.hotelInfoText}>
                Email: {hotelInfo.partner}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mã giảm giá của bạn</Text>
            <FlatList
              data={userDiscounts}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDiscount(item);
                    setDiscountValue(item.discount); // Lưu giá trị discount khi chọn
                    setModalVisible(false);
                  }}>
                  <Text style={styles.discountItem}>
                    {item.code} - Giảm {item.discount}%
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bodyContainer: {
    marginHorizontal: 10,
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roomImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  inputBodyContainer: {
    marginBottom: 20,
  },
  guestsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  guestLabel: {
    fontSize: sizes.h3,
    color: colors.primary,
  },
  guestControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestControl: {
    fontSize: sizes.h2,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  guestCount: {
    fontSize: sizes.h3,
    paddingHorizontal: 10,
  },
  discountContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  discountText: {
    fontSize: sizes.h3,
    color: colors.green,
  },
  pricePerNight: {
    fontSize: sizes.h4,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  discountItem: {
    fontSize: sizes.h3,
    paddingVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: sizes.h3,
  },
  hotelInfoContainer: {
    marginTop: 20,
  },
  hotelInfoTitle: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  hotelInfoText: {
    fontSize: sizes.h3,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 1,
  },
  backIcon: {
    backgroundColor: colors.white,
    padding: 4,
    borderRadius: sizes.radius,
    ...shadow.light,
  },
  priceContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },

  priceWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10, // Bo góc view
    padding: 10,
    marginBottom: 10, // Để nút "Đặt phòng" cách phần giá một khoảng
    alignItems: 'center',
    width: '100%',
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },

  originalPriceLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    color: colors.primary,
  },
  discountedPriceLabel: {
    fontWeight: 'bold',
    color: colors.green,
    fontSize: 18,
  },

  discountedPrice: {
    color: colors.green,
    fontSize: sizes.h2,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: sizes.h3,
    textDecorationLine: 'line-through',
    color: 'red',
    fontWeight: 'bold',
  },
  firstPrice: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.primary,
  },

  customButton: {
    marginTop: 10,
    backgroundColor: colors.green,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: sizes.h3,
    fontWeight: 'bold',
  },
});

export default BookingScreen;
