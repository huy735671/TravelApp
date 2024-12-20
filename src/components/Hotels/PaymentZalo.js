import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Linking} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, sizes} from '../../constants/theme';
import {color} from 'react-native-elements/dist/helpers';

// ZaloPay configuration
const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
  query_endpoint: 'https://sb-openapi.zalopay.vn/v2/query',
};

const formatCurrency = amount => {
  return amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const PaymentZalo = ({route, navigation}) => {
  const {bookingId, totalAmount, email, fullName, phone} = route.params;
  console.log(route.params);

  const [lastTransactionId, setLastTransactionId] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedFullName, setEditedFullName] = useState(fullName);
  const [editedphone, setEditedphone] = useState(phone);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    let intervalId;
  
    if (lastTransactionId) {
      intervalId = setInterval(async () => {
        try {
          const data = `${config.app_id}|${lastTransactionId}|${config.key1}`;
          const mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  
          const response = await fetch(config.query_endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `app_id=${config.app_id}&app_trans_id=${lastTransactionId}&mac=${mac}`,
          });
  
          const result = await response.json();
  
          if (result.return_code === 1) {
            clearInterval(intervalId);
            await firestore().collection('bookings').doc(bookingId).update({
              paymentStatus: 'completed',
            });
            Alert.alert(
              'Thanh toán thành công',
              'Đơn đặt phòng của bạn đã được xác nhận.',
              [
                {
                  text: 'OK',
                  onPress: () =>
                    navigation.navigate('BookingSuccess', {bookingId}),
                },
              ]
            );
          } else if (result.return_code === 2) {
            clearInterval(intervalId);
            await firestore().collection('bookings').doc(bookingId).update({
              paymentStatus: 'failed',
              status: 'cancelled',
            });
            Alert.alert('Thanh toán thất bại', 'Vui lòng thử lại sau.');
          }
        } catch (error) {
          console.error('Error checking status:', error);
        }
      }, 5000); // Check every 5 seconds
    }
  
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [lastTransactionId]);
  

  const validatePaymentData = () => {
    if (!email) {
      throw new Error('Email không được để trống');
    }
    if (!totalAmount || totalAmount < 1000) {
      throw new Error('Số tiền thanh toán phải lớn hơn 1000 VND');
    }
    if (!bookingId) {
      throw new Error('Mã đặt phòng không hợp lệ');
    }
    if (!editedFullName?.trim() || !editedphone?.trim()) {
      throw new Error('Vui lòng cập nhật đầy đủ thông tin cá nhân');
    }
  };

  // Create ZaloPay order with error handling
  const createZaloPayOrder = async order => {
    try {
      console.log('Sending order to ZaloPay:', JSON.stringify(order, null, 2));

      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('ZaloPay response:', responseData);

      if (responseData.return_code !== 1) {
        console.log('Error code:', responseData.return_code);
        console.log('Error message:', responseData.return_message);
        throw new Error(responseData.return_message || 'Giao dịch thất bại');
      }

      return responseData;
    } catch (error) {
      console.error('ZaloPay API Error details:', error);
      throw new Error('Không thể kết nối đến ZaloPay: ' + error.message);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Validate input data
      validatePaymentData();

      const timestamp = moment().format('YYMMDDHHmmss');
      const appTransId = `${timestamp}_${email.split('@')[0]}`;

      // Update booking status first
      await firestore().collection('bookings').doc(bookingId).update({
        paymentMethod: 'ZaloPay',
        transactionId: appTransId,
        paymentStatus: 'pending',
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      // Prepare order data
      const order = {
        app_id: parseInt(config.app_id), // Convert to integer
        app_trans_id: appTransId,
        app_user: email.split('@')[0],
        app_time: Date.now(),
        amount: parseInt(totalAmount), // Convert to integer
        description: `Thanh toán đặt phòng #${bookingId}`,
        bank_code: 'zalopayapp',
        callback_url: 'https://yourdomain.com/callback',
        item: JSON.stringify([
          {
            itemid: bookingId,
            itemname: 'Hotel Booking Payment',
            itemprice: parseInt(totalAmount),
            itemquantity: 1,
          },
        ]),
        embed_data: JSON.stringify({
          redirecturl: 'https://yourdomain.com/redirect',
        }),
      };

      // Tạo MAC theo thứ tự chính xác
      const dataStr =
        config.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;

      order.mac = CryptoJS.HmacSHA256(dataStr, config.key1).toString();
      // Create ZaloPay order
      const responseData = await createZaloPayOrder(order);

      setLastTransactionId(appTransId);
      await Linking.openURL(responseData.order_url);
    } catch (error) {
      console.error('Payment Error:', error);
      Alert.alert('Lỗi Thanh Toán', error.message);

      // Revert booking status if payment fails
      try {
        await firestore().collection('bookings').doc(bookingId).update({
          paymentStatus: 'failed',
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      } catch (revertError) {
        console.error('Error reverting booking status:', revertError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkTransactionStatus = async () => {
    if (!lastTransactionId) {
      Alert.alert('Error', 'Không có giao dịch nào để kiểm tra.');
      return;
    }

    try {
      const data = `${config.app_id}|${lastTransactionId}|${config.key1}`;
      const mac = CryptoJS.HmacSHA256(data, config.key1).toString();

      const response = await fetch(config.query_endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `app_id=${config.app_id}&app_trans_id=${lastTransactionId}&mac=${mac}`,
      });

      const result = await response.json();

      if (result.return_code === 1) {
        // Payment successful
        await firestore().collection('bookings').doc(bookingId).update({
          paymentStatus: 'completed',
          //   status: 'confirmed'
        });

        Alert.alert(
          'Thanh toán thành công',
          'Đơn đặt phòng của bạn đã được xác nhận.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('BookingSuccess', {bookingId}),
            },
          ],
        );
      } else if (result.return_code === 2) {
        // Payment failed
        await firestore().collection('bookings').doc(bookingId).update({
          paymentStatus: 'failed',
          status: 'cancelled',
        });

        Alert.alert('Thanh toán thất bại', 'Vui lòng thử lại sau.');
      } else {
        Alert.alert(
          'Đang xử lý',
          'Giao dịch đang được xử lý. Vui lòng thử lại sau.',
        );
      }
    } catch (error) {
      console.error('Status Check Error:', error);
      Alert.alert('Error', 'Không thể kiểm tra trạng thái giao dịch.');
    }
  };

  const handleUpdateInfo = async () => {
    if (!editedFullName.trim() || !editedphone.trim()) {
      Alert.alert('Error', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await firestore().collection('bookings').doc(bookingId).update({
        fullName: editedFullName,
        phone: editedphone,
      });

      setIsEditModalVisible(false);
      Alert.alert('Thành công', 'Đã cập nhật thông tin');
    } catch (error) {
      console.error('Update Error:', error);
      Alert.alert('Error', 'Không thể cập nhật thông tin');
    }
  };

  return (
    <View style={styles.bodyContainer}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Thanh toán trực tuyến</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Thông tin thanh toán</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditModalVisible(true)}>
              <Text style={styles.editButtonText}>Sửa thông tin</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Họ tên:</Text>
            <Text style={styles.value}>{editedFullName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.value}>{editedphone || 'Chưa cập nhật'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Mã đơn hàng:</Text>
            <Text style={styles.value}>{bookingId}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Số tiền:</Text>
            <Text style={styles.amount}>{formatCurrency(totalAmount)} VNĐ</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handlePayment}>
            <Text style={styles.buttonText}>Thanh toán với ZaloPay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={checkTransactionStatus}>
            <Text style={styles.buttonTextCheck}>Kiểm tra trạng thái</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={async () => {
              try {
                // Xóa phòng khỏi Firestore
                await firestore()
                  .collection('bookings')
                  .doc(bookingId)
                  .delete();

                // Quay lại màn hình trước đó
                navigation.goBack();
              } catch (error) {
                console.error('Error deleting booking:', error);
                Alert.alert(
                  'Lỗi',
                  'Không thể hủy đặt phòng, vui lòng thử lại.',
                );
              }
            }}>
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={isEditModalVisible}
          transparent={true}
          animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cập nhật thông tin</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Họ tên:</Text>
                <TextInput
                  style={styles.input}
                  value={editedFullName}
                  onChangeText={setEditedFullName}
                  placeholder="Nhập họ tên"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Số điện thoại:</Text>
                <TextInput
                  style={styles.input}
                  value={editedphone}
                  onChangeText={setEditedphone}
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsEditModalVisible(false)}>
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.primaryButton]}
                  onPress={handleUpdateInfo}>
                  <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default PaymentZalo;

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 50,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 16,
  },
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    color: colors.primary,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: sizes.body,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  label: {
    fontSize: 16,
    color: '#546E7A',
    flex: 1,
  },

  value: {
    fontSize: 16,
    color: '#37474F',
    flex: 2,
    textAlign: 'right',
  },

  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1976D2',
    flex: 2,
    textAlign: 'right',
  },

  buttonContainer: {
    padding: 16,
  },

  button: {
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  primaryButton: {
    backgroundColor: '#2196F3',
  },

  secondaryButton: {
    backgroundColor: colors.light,
  },
  buttonTextCheck: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: sizes.h3,
  },
  cancelButton: {
    backgroundColor: '#FF4444',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  editButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A237E',
    marginBottom: 20,
    textAlign: 'center',
  },

  inputContainer: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 16,
    color: '#546E7A',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },

  saveButton: {
    backgroundColor: '#2196F3',
  },

  cancelButton: {
    backgroundColor: '#FF4444',
  },
});
