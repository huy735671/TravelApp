import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import {colors} from '../../constants/theme';
import ChildPolicy from './ChildPolicy';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const {height} = Dimensions.get('window');

const RoomsBottomSheet = ({hotelId, onClose}) => {
  const bottomSheetRef = useRef(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null); // Đặt giá trị khởi tạo là null
  const [checkOutDate, setCheckOutDate] = useState(null); // Đặt giá trị khởi tạo là null
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const navigation = useNavigation();

  const formatCurrency = amount => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND';
  };

  useEffect(() => {
    const fetchRooms = async () => {
      const roomsCollection = await firestore()
        .collection('rooms')
        .where('hotelId', '==', hotelId)
        .get();
      setRooms(roomsCollection.docs.map(doc => ({id: doc.id, ...doc.data()})));
    };

    fetchRooms();
  }, [hotelId]);

  const openDetailView = room => {
    // Bỏ kiểm tra ngày nhận và ngày trả phòng
    setSelectedRoom(room);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const openBookingDetail = room => {
    if (!checkInDate || !checkOutDate) {
      Toast.show({
        text1: 'Thông báo',
        text2: 'Vui lòng chọn ngày nhận và ngày trả phòng trước khi đặt.',
        type: 'info',
        position: 'top',
      });
      return;
    }
    navigation.navigate('BookingScreen', {
      room,
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
    });
  };

  const closeDetailView = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedRoom(null));
  };

  const onCheckInChange = (event, selectedDate) => {
    setShowCheckInPicker(false);
    if (selectedDate) {
      setCheckInDate(selectedDate);

      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1); // Thêm 1 ngày
      setCheckOutDate(nextDay); // Đặt ngày trả phòng bằng ngày kế tiếp
    }
  };

  const onCheckOutChange = (event, selectedDate) => {
    setShowCheckOutPicker(false);
    if (selectedDate) {
      const isNextDay =
        selectedDate > checkInDate &&
        selectedDate >= new Date(checkInDate.getTime() + 86400000);
      if (isNextDay) {
        setCheckOutDate(selectedDate);
      } else {
        Toast.show({
          text1: 'Thông báo',
          text2: 'Ngày trả phòng phải lớn hơn ngày nhận phòng ít nhất 1 ngày!',
          type: 'info',
          position: 'top',
        });
      }
    }
  };

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={['50%', '90%']}
        onClose={onClose}
        enablePanDownToClose>
        <View style={styles.container}>
          <Text style={styles.title}>Danh sách phòng</Text>

          {/* Date selection section */}
          <View style={styles.datePickerContainer}>
            <View style={styles.dateInputContainer}>
              <Pressable
                onPress={() => setShowCheckInPicker(true)}
                style={styles.datePickerButton}>
                <Text style={styles.datePickerText}>
                  Ngày nhận phòng{' '}
                  {checkInDate
                    ? checkInDate.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : ''}
                </Text>
                <Text style={styles.placeholderText}>
                  {checkInDate ? '' : 'Chưa chọn'}
                </Text>
              </Pressable>
              {showCheckInPicker && (
                <DateTimePicker
                  value={checkInDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={onCheckInChange}
                  minimumDate={new Date()}
                />
              )}
              <Pressable
                onPress={() => setShowCheckOutPicker(true)}
                style={styles.datePickerButton}>
                <Text style={styles.datePickerText}>
                  Ngày trả phòng{' '}
                  {checkOutDate
                    ? checkOutDate.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : ''}
                </Text>
                <Text style={styles.placeholderText}>
                  {checkOutDate ? '' : 'Chưa chọn'}
                </Text>
              </Pressable>
              {showCheckOutPicker && (
                <DateTimePicker
                  value={
                    checkOutDate || new Date(checkInDate.getTime() + 86400000)
                  } // Đặt ngày trả phòng bằng ngày kế tiếp nếu ngày nhận đã chọn
                  mode="date"
                  display="default"
                  onChange={onCheckOutChange}
                  minimumDate={checkInDate || new Date()}
                />
              )}
            </View>
          </View>

          <FlatList
            data={rooms}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.roomItem}
                onPress={() => openBookingDetail(item)}>
                {/* <Text style={styles.roomText}>Phòng: {item.roomNumber}</Text> */}
                <Text style={styles.roomText}>Loại: {item.roomType}</Text>
                <Text style={styles.roomText}>
                  Sức chứa: {item.capacity} người + trẻ em
                </Text>
                <Text style={styles.roomText}>
                  Giá 1 đêm: {formatCurrency(item.pricePerNight)}
                </Text>
                <Text style={styles.roomText}>Tầm nhìn: {item.view}</Text>
                <Text style={styles.roomText}>Trạng thái: {item.status}</Text>
                <Pressable
                  onPress={() => openDetailView(item)}
                  style={styles.infoButton}>
                  <Text style={styles.infoButtonText}>i</Text>
                </Pressable>
              </TouchableOpacity>
            )}
          />
        </View>
      </BottomSheet>

      {selectedRoom && (
        <Animated.View
          style={[styles.detailView, {transform: [{translateY: slideAnim}]}]}>
          <View style={styles.detailContent}>
            <View style={styles.header}>
              <Text style={styles.modalTitle}>Thông tin phòng</Text>
              <Pressable onPress={closeDetailView} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedRoom.image && (
                <Image
                  source={{uri: selectedRoom.image}}
                  style={styles.roomImage}
                />
              )}
              {/* <Text style={styles.bodyText}>
                Phòng: {selectedRoom.roomNumber}
              </Text> */}
              <Text style={styles.bodyText}>Loại: {selectedRoom.roomType}</Text>
              <Text style={styles.bodyText}>
                Sức chứa: {selectedRoom.capacity} người + trẻ em
              </Text>
              <Text style={styles.bodyText}>
                Diện tích: {selectedRoom.area} m²
              </Text>
              <Text style={styles.bodyText}>
                Giá 1 đêm: {formatCurrency(selectedRoom.pricePerNight)}
              </Text>
              <Text style={styles.bodyText}>Tầm nhìn: {selectedRoom.view}</Text>
              <Text style={styles.bodyText}>
                Trạng thái: {selectedRoom.status}
              </Text>
              <Text style={styles.bodyText}>
                Hút thuốc: {selectedRoom.allowSmoking ? 'Có' : 'Không'}
              </Text>

              <View style={styles.amenitiesContainer}>
                <Text style={styles.amenitiesTitle}>Tiện nghi:</Text>
                <View style={styles.amenitiesList}>
                  {selectedRoom.amenities.map((amenity, index) => (
                    <Text key={index} style={styles.amenityItem}>
                      {amenity}
                    </Text>
                  ))}
                </View>
              </View>
              <ChildPolicy />
            </ScrollView>
          </View>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  datePickerButton: {
    padding: 12,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#b2ebf2',
  },
  datePickerText: {
    fontSize: 16,
    color: '#00796b',
  },
  roomItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3, // for Android shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  roomText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#424242', // dark gray for text
  },
  infoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 8,
    elevation: 2,
  },
  infoButtonText: {
    color: 'white',
    fontSize: 18,
  },
  detailView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.8,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  detailContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.primary,
  },
  roomImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  bodyText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#424242',
  },
  amenitiesContainer: {
    marginTop: 15,
  },
  amenitiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
    padding: 8,
    margin: 4,
  },
});

export default RoomsBottomSheet;
