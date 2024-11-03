import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {colors, sizes} from '../../constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from '../shared/Icon';
import FooterLogin from './FooterLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pwdHidden, setPwdHidden] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState(null); // Lưu thông tin người dùng

  const navigation = useNavigation();

  const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handlerLogin = async () => {
    setErrorMessage('');
  
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
  
    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage('Vui lòng nhập email và mật khẩu.');
      return;
    }
  
    if (!validateEmail(trimmedEmail)) {
      setErrorMessage('Địa chỉ email không hợp lệ.');
      return;
    }
  
    try {
      await auth().signInWithEmailAndPassword(trimmedEmail, trimmedPassword);
  
      // Lưu email vào AsyncStorage
      await AsyncStorage.setItem('userEmail', trimmedEmail);
  
      // Lấy thông tin người dùng từ Firestore
      const querySnapshot = await firestore()
        .collection('users')
        .where('email', '==', trimmedEmail)
        .get();
  
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async doc => {
          const data = doc.data();
          setUserData(data);
  
          // Lưu avatarUrl và username vào AsyncStorage
          await AsyncStorage.setItem('avatarUrl', data.avatarUrl || '');
          await AsyncStorage.setItem('username', data.username || '');
        });
      } else {
        console.log('Không tìm thấy tài liệu người dùng với email này trong Firestore.');
      }
  
      navigation.replace('Root');
    } catch (error) {
      setErrorMessage('Sai tài khoản hoặc mật khẩu! Vui lòng thử lại.');
    }
  };
  

  const loadUserData = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('userEmail');
      const savedAvatar = await AsyncStorage.getItem('avatarUrl');
      const savedUsername = await AsyncStorage.getItem('username');

      if (savedEmail) {
        setEmail(savedEmail);
        setUserData({
          avatarUrl: savedAvatar,
          username: savedUsername,
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon icon="Back" size={40} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.imageBox}>
          {userData && userData.avatarUrl ? (
            <Image
              source={{uri: userData.avatarUrl}}
              style={styles.avatar}
            />
          ) : (
            <Image
              source={require('../../../assets/images/LoginIcon.png')}
              style={styles.img}
            />
          )}
        </View>

        {userData && userData.username ? (
          <Text style={styles.welcomeText}>
            Chào mừng trở lại, {userData.username} !
          </Text>
        ) : null}

        <View style={styles.loginContainer}>
          <View style={{marginBottom: 20}} />
          <Text style={styles.label}>Email:</Text>
          <View style={styles.bodyContainer}>
            <Icon icon="Email" size={30} style={styles.LoginIcon} />
            <TextInput
              placeholder="Email tài khoản"
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={setEmail}
              value={email}
            />
          </View>

          <Text style={styles.label}>Mật khẩu:</Text>
          <View style={styles.bodyContainer}>
            <Icon icon="Key" size={30} style={styles.LoginIcon} />
            <TextInput
              placeholder="Mật khẩu"
              autoCapitalize="none"
              style={styles.textInput}
              secureTextEntry={pwdHidden}
              onChangeText={setPassword}
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
            <TouchableOpacity
              style={{position: 'absolute', right: 0}}
              onPress={() => navigation.navigate('ResetPw')}>
              <Text style={styles.forgetPassText}>Quên mật khẩu ?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handlerLogin} style={styles.buttonLogin}>
            <Text style={styles.buttonLoginText}>Đăng nhập</Text>
          </TouchableOpacity>
          <View style={{marginTop: 50}} />
          <FooterLogin />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7b70f9',
  },
  headerContainer: {
    marginLeft: 10,
    padding: 10,
  },
  icon: {
    backgroundColor: colors.green,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  imageBox: {
    alignItems: 'center',
  },
  img: {
    width: 250,
    height: 250,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  loginContainer: {
    height: '100%',
    backgroundColor: colors.light,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },
  bodyContainer: {
    width: WINDOW_WIDTH - 60,
    height: 45,
    marginLeft: 30,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  label: {
    marginLeft: 30,
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    marginBottom: 20,
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
    fontSize: sizes.h2,
    fontWeight: '600',
    color: colors.light,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
