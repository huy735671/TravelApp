import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Linking, Modal, TextInput } from 'react-native';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import { useCart } from '../routers/CartContext';
import { useMyContextProvider } from "../index"; // Import the context hook
import firestore from "@react-native-firebase/firestore";
import auth from '@react-native-firebase/auth';

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
  query_endpoint: "https://sb-openapi.zalopay.vn/v2/query"
};

// Format currency to add dots every three digits
const formatCurrency = (amount) => {
  return amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function PaymentZalo({ navigation, route }) {
  const { appointmentId } = route.params || {};
  const [controller] = useMyContextProvider();
  const { userLogin } = controller;
  const [lastTransactionId, setLastTransactionId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState({
    totalAmount: 0,
    address: '',
    phoneNumber: '',
    services: [],
    email: '',
    fullName: ''
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedFullName, setEditedFullName] = useState('');
  const [editedPhoneNumber, setEditedPhoneNumber] = useState('');

  // Fetch appointment details from Firebase
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (appointmentId) {
        try {
          const appointmentDoc = await firestore().collection('Appointments').doc(appointmentId).get();

          if (appointmentDoc.exists) {
            const data = appointmentDoc.data();
            setAppointmentDetails({
              totalAmount: data.discountValue || 0,
              address: data.address || 'Chưa có thông tin',
              phoneNumber: data.phone || 'Chưa có thông tin',
              services: data.services || [],
              email: data.email || '',
              fullName: data.fullName || 'Khách hàng'
            });

            if (data.email) {
              setCurrentUser({ email: data.email });
            }
          } else {
            console.log('Appointment not found');
            Alert.alert('Lỗi', 'Không tìm thấy thông tin đơn hàng');
            navigation.goBack();
          }
        } catch (error) {
          console.error('Error fetching appointment details:', error);
          Alert.alert('Lỗi', 'Không thể tải thông tin đơn hàng');
        }
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId]);

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' }
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          display: 'flex',
          height: 60,
          position: 'absolute',
          bottom: 16,
          right: 16,
          left: 16,
          borderRadius: 16
        }
      });
    };
  }, [navigation]);

  const handlePayment = async () => {
    if (!currentUser?.email) {
        Alert.alert('Error', 'Vui lòng đăng nhập để tiếp tục');
        navigation.goBack();
        return;
    }

    if (!appointmentDetails.totalAmount) {
        Alert.alert('Error', 'Số tiền thanh toán không hợp lệ');
        return;
    }

    if (!appointmentId) {
        Alert.alert('Error', 'Không tìm thấy mã đơn hàng');
        return;
    }

    const customerId = currentUser.email.split('@')[0];
    const timestamp = moment().format('YYMMDDHHmmss');
    const app_trans_id = `${timestamp}_${customerId}`;

    try {
        const appointmentRef = firestore().collection("Appointments").doc(appointmentId);
        const appointmentDoc = await appointmentRef.get();

        if (!appointmentDoc.exists) {
            Alert.alert('Error', 'Không tìm thấy thông tin đơn hàng');
            return;
        }

        await appointmentRef.update({
            paymentMethod: "ZaloPay",
            transactionId: app_trans_id,
            state: "pending",
            updatedAt: firestore.FieldValue.serverTimestamp()
        });

        // Proceed with initiating the payment
        await initiateZaloPayment(app_trans_id, appointmentDetails.totalAmount);
    } catch (error) {
        console.error("Error updating payment info: ", error);
        Alert.alert('Error', 'Không thể xử lý thanh toán. Vui lòng thử lại.');
    }
};

const initiateZaloPayment = async (app_trans_id, totalAmount) => {
    try {
        if (!currentUser?.email) throw new Error('Thông tin người dùng không hợp lệ');
        const amount = parseInt(totalAmount);
        if (isNaN(amount) || amount <= 0) throw new Error('Số tiền thanh toán không hợp lệ');

        const items = [{
            itemid: appointmentId,
            itemname: appointmentDetails.services?.[0]?.title || 'Service Payment',
            itemprice: amount,
            itemquantity: 1
        }];

        const embedData = JSON.stringify({
            merchantinfo: "Beauty Service Payment",
            redirecturl: "https://yourdomain.com/redirect"
        });

        const order = {
          app_id: 2553,
          app_user: userLogin.email.split('@')[0],
          app_trans_id: app_trans_id,
          app_time: Date.now(),
          amount: totalAmount,
          item: JSON.stringify(items),
          description: 'Thanh toán đơn hàng #' + app_trans_id,
          embed_data: JSON.stringify({ promotioninfo: "", merchantinfo: "du lieu rieng cua ung dung" }),
          bank_code: "zalopayapp",
          callback_url: "https://yourdomain.com/callback",
          mac: ""
        };

        const data = [
            config.app_id,
            order.app_trans_id,
            order.app_user,
            order.amount,
            order.app_time,
            order.embed_data,
            order.item
        ].join("|");

        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });

        const responseData = await response.json();
        if (responseData.return_code === 1) {
            setLastTransactionId(app_trans_id);
            if (responseData.order_url) {
                await Linking.openURL(responseData.order_url);
                Alert.alert('Success', 'Đang chuyển đến trang thanh toán');
            } else {
                throw new Error('Không nhận được đường dẫn thanh toán');
            }
        } else {
            throw new Error(responseData.return_message || 'Giao dịch thất bại');
        }
    } catch (error) {
        console.error('Payment Error:', error);
        Alert.alert('Error', 'Không thể xử lý thanh toán: ' + (error.message || 'Vui lòng thử lại'));
    }
};

return (
  <View style={styles.container}>
    <Text style={styles.title}>Thanh toán với ZaloPay</Text>
    <View style={styles.orderCard}>
      <Text style={styles.label}>Khách hàng: {appointmentDetails.fullName}</Text>
      <Text style={styles.label}>Số tiền: {formatCurrency(appointmentDetails.totalAmount)} VNĐ</Text>
      <Text style={styles.label}>Địa chỉ: {appointmentDetails.address}</Text>
      <TouchableOpacity onPress={handlePayment}>
        <Text style={styles.paymentButton}>Thanh toán</Text>
      </TouchableOpacity>
    </View>
  </View>
);
}
