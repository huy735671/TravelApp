import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {colors, sizes} from '../../constants/theme';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('huynew@gmail.com');
  const [password, setPassword] = useState('123456Huy');
  const [pwdHidden, setPwdHidden] = useState(true);
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const navigation = useNavigation();

  const validateEmail = email => {
    // Regex để kiểm tra định dạng email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handlerLogin = async () => {
    setErrorMessage(''); // Reset error message

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!validateEmail(trimmedEmail)) {
      setErrorMessage('Địa chỉ email không hợp lệ.');
      return;
    }

    try {
      // Đăng nhập với Firebase Auth
      await auth().signInWithEmailAndPassword(trimmedEmail, trimmedPassword);

      console.log('Đăng nhập thành công với email:', trimmedEmail);

      // Truy xuất dữ liệu người dùng dựa trên email trong Firestore
      const querySnapshot = await firestore()
        .collection('users')
        .where('email', '==', trimmedEmail) // Truy vấn dựa trên email
        .get();

      if (!querySnapshot.empty) {
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          console.log('Thông tin người dùng từ Firestore:', userData);
        });
      } else {
        console.log(
          'Không tìm thấy tài liệu người dùng với email này trong Firestore.',
        );
      }

      navigation.replace('Root'); // Chuyển hướng sau khi đăng nhập thành công
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('Không tìm thấy tài khoản với địa chỉ email này.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Sai mật khẩu. Vui lòng thử lại.');
      } else {
        setErrorMessage('Đăng nhập thất bại. Vui lòng thử lại sau.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleHeader}>Login your account.</Text>

      <View style={styles.bodyContainer}>
        <Icons name="email" size={30} style={styles.LoginIcon} />
        <TextInput
          placeholder="E-mail"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={setEmail}
          value={email}
        />
      </View>

      <View style={styles.bodyContainer}>
        <Ionicons name="lock-closed" size={30} style={styles.LoginIcon} />
        <TextInput
          placeholder="Password"
          autoCapitalize="none" // Sử dụng "none" để tránh tự động viết hoa
          style={styles.textInput}
          secureTextEntry={pwdHidden}
          onChangeText={setPassword} // Sử dụng onChangeText thay cho onChange
          value={password}
        />

        <TouchableOpacity
          style={{
            height: '100%',
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setPwdHidden(!pwdHidden)}>
          <Ionicons
            name={pwdHidden ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            style={{width: 24, height: 24, color: 'gray'}}
          />
        </TouchableOpacity>
      </View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <View style={styles.forgetPassContainer}>
        <TouchableOpacity style={{position: 'absolute', right: 0}}>
          <Text style={styles.forgetPassText}>Forget password ?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handlerLogin} style={styles.buttonLogin}>
        <Text style={styles.buttonLoginText}>Login</Text>
      </TouchableOpacity>

      <View></View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 30,
  },
  bodyContainer: {
    width: WINDOW_WIDTH - 60,
    height: 45,
    marginLeft: 30,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  LoginIcon: {
    color: colors.gray,
    resizeMode: 'stretch',
    marginHorizontal: 10,
  },
  textInput: {
    height: '100%',
    flex: 1,
    fontSize: 16,
  },
  forgetPassContainer: {
    width: WINDOW_WIDTH - 60,
    marginLeft: 30,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgetPassText: {
    color: '#707070',
  },
  buttonLogin: {
    height: 50,
    width: WINDOW_WIDTH - 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4c8d6e',
    marginTop: 20,
    marginLeft: 30,
    borderRadius: 100,
  },
  buttonLoginText: {
    color: colors.white,
    fontSize: sizes.h3,
  },
  errorText: {
    color: 'red', // Màu sắc cho thông báo lỗi
    textAlign: 'center',
    marginBottom: 10, // Khoảng cách dưới thông báo lỗi
  },
});
