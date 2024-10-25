import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import Toast from 'react-native-toast-message'; // Import Toast
import {sizes} from '../../constants/theme';

const ResetPw = () => {
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Email validation function using regex
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = () => {
    if (email.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Vui lòng nhập email',
      });
      return;
    }

    // Check if the entered email is valid
    if (!validateEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Email không hợp lệ. Vui lòng nhập đúng định dạng email.',
      });
      return;
    }

    // Show modal for success case
    setModalMessage('Yêu cầu đặt lại mật khẩu đã được gửi đến ' + email);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>
      <Text style={styles.subtitle}>
        Nhập email tài khoản của bạn để có thể đổi lại mật khẩu
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập email của bạn"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Gửi yêu cầu</Text>
      </TouchableOpacity>

      {/* Modal for successful password reset */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Toast message */}
      <Toast />
    </View>
  );
};

export default ResetPw;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 50,
  },
  subtitle: {
    fontSize: sizes.h3,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  input: {
    width: '100%',
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#ecf0f1',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});