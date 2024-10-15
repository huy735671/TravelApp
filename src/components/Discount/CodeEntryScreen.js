import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
} from 'react-native';
import { colors } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { sizes, spacing } from '../../constants/theme';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const CodeEntryScreen = () => {
  const [code, setCode] = useState('');
  const [enteredCodes, setEnteredCodes] = useState(new Set());
  const [message, setMessage] = useState(''); // State để lưu thông báo

  const handleCodeSubmit = async () => {
    const user = auth().currentUser;
    if (!user) {
      alert('Vui lòng đăng nhập để áp dụng mã.');
      return;
    }
  
    if (enteredCodes.has(code)) {
      setMessage('Bạn đã nhập mã này rồi.'); // Cập nhật thông báo
      return;
    }
  
    try {
      const discountSnapshot = await firestore()
        .collection('discounts')
        .where('code', '==', code)
        .get();
  
      if (!discountSnapshot.empty) {
        const userDiscountsSnapshot = await firestore()
          .collection('userDiscounts')
          .where('userId', '==', user.email)
          .where('discountId', '==', discountSnapshot.docs[0].id)
          .get();
  
        if (!userDiscountsSnapshot.empty) {
          setMessage('Bạn đã nhập mã này rồi.'); // Cập nhật thông báo
          return;
        }
  
        const userDiscountsRef = firestore().collection('userDiscounts');
        await userDiscountsRef.add({
          discountId: discountSnapshot.docs[0].id,
          userId: user.email,
          usedBy: false, // Thêm thuộc tính usedBy ở đây
        });
  
        setEnteredCodes((prevCodes) => new Set(prevCodes).add(code));
        setCode('');
  
        setMessage('Mã đã được áp dụng thành công!'); // Cập nhật thông báo
      } else {
        setMessage('Mã không hợp lệ.'); // Cập nhật thông báo
      }
    } catch (error) {
      console.error('Error applying discount code: ', error);
      setMessage('Đã xảy ra lỗi khi áp dụng mã. Vui lòng thử lại.'); // Cập nhật thông báo
    }
  };
  
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Nhập mã</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập mã khuyến mãi"
            placeholderTextColor="#888"
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleCodeSubmit}>
            <Text style={styles.buttonText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>

        {message ? ( // Hiển thị thông báo nếu có
          <Text style={styles.message}>{message}</Text>
        ) : null}

        <View style={styles.describeContainer}>
          <View style={styles.describeItem}>
            <Icons name="check-circle" size={20} color="#4CAF50" />
            <Text style={styles.describeText}>
              Mã chương trình khuyến mãi hoặc số điện thoại người giới thiệu cho
              bạn.
            </Text>
          </View>
          <View style={styles.describeItem}>
            <Icons name="check-circle" size={20} color="#4CAF50" />
            <Text style={styles.describeText}>
              Đối với người dùng mới, CTKM tham gia được tính bằng mã mà người
              dùng nhập cuối cùng trước khi liên kết ngân hàng.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerTitleText}>
          Ưu đãi đặc biệt từ TravelNest
        </Text>
        <View style={styles.footerImageBox}>
          <Image
            source={require('../../../assets/images/images.jpg')}
            style={styles.imageBox}
          />
          <View>
            <Text style={styles.imagetitle}>Giới thiệu bạn bè</Text>
            <Text style={[styles.imagedescribeText]}>
              Nhận quà đến 500k thanh toán mọi dịch vụ
            </Text>
          </View>
          <Button title="Xem ngay" color='#4c8d6e' />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    elevation: 25,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#4D8D6E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 10,
    color: 'red', // Hoặc màu khác tùy thuộc vào thông báo
  },
  describeContainer: {
    marginTop: 20,
    width: '100%',
  },
  describeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  describeText: {
    marginLeft: 10,
    fontSize: spacing.m - 2,
    color: colors.black,
  },
  footerContainer: {
    marginTop: 10,
    marginLeft: 10,
  },
  footerTitleText: {
    fontSize: sizes.h2 - 5,
    fontWeight: 'bold',
    color: colors.black,
  },
  footerImageBox: {
    height: 120,
    flexDirection: 'row',
    borderRadius: 20,
    elevation: 25,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageBox: {
    height: '70%',
    width: '15%',
  },
  imagetitle: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    color: colors.black,
  },
  imagedescribeText: {
    textAlign: 'justify',
    flexWrap: 'wrap',
    width: 160,
  },
});

export default CodeEntryScreen;
