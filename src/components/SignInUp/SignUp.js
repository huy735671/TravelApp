import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {colors, sizes} from '../../constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from '../shared/Icon';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Picker} from '@react-native-picker/picker';

const provinces = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Cần Thơ',
  'Hải Phòng',
  'Hải Dương',
  'Quảng Ninh',
  'Bắc Giang',
  'Bắc Kạn',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Dương',
  'Bình Định',
  'Bình Phước',
  'Bình Thuận',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hậu Giang',
  'Hòa Bình',
  'Hồ Chí Minh',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên-Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái',
];

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pwdHidden, setPwdHidden] = useState(true);
  const [address, setAddress] = useState('');

  const [avatar, setAvatar] = useState(null);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!email || !password || !fullName || !phoneNumber) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }

    try {
      // Đăng ký người dùng với Firebase Authentication
      await auth().createUserWithEmailAndPassword(email, password);

      // Lưu thông tin bổ sung vào Firestore sử dụng email làm ID
      await firestore()
        .collection('users')
        .doc(email) // Sử dụng email làm ID
        .set({
          username: fullName,
          email,
          phone: phoneNumber,
          role: 'user', // Bạn có thể thay đổi vai trò mặc định nếu cần
          address,
          avatarUrl: avatar || '', // Đổi tên trường thành avatarUrl
          uid: auth().currentUser.uid, // Lưu thêm uid để tiện quản lý
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      alert('Đăng ký thành công!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert('Đăng ký thất bại! Vui lòng thử lại.');
    }
  };

  const handleSelectImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // Lấy URI của ảnh
        const imageUri = response.assets[0].uri;

        // Tạo tên tệp duy nhất cho ảnh
        const fileName = `avatar_${Date.now()}.jpg`;

        // Tải ảnh lên Firebase Storage
        const reference = storage().ref(fileName);

        try {
          await reference.putFile(imageUri); // Tải tệp lên Firebase Storage

          // Lấy URL của ảnh sau khi tải lên
          const imageUrl = await reference.getDownloadURL();

          // Cập nhật trạng thái avatar với URL của ảnh
          setAvatar(imageUrl);

          // Lưu URL vào Firestore (cập nhật avatarUrl trong document)
          await firestore().collection('users').doc(email).update({
            avatarUrl: imageUrl, // Lưu URL ảnh vào Firestore
          });

          console.log('Ảnh đã được tải lên và URL đã được lưu!');
        } catch (error) {
          console.log('Lỗi khi tải ảnh lên Firebase Storage:', error);
        }
      }
    });
  };

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
            <Icon icon="Back" size={40} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.imageBox}>
          <Image
            source={require('../../../assets/images/SingiupIcon.png')}
            style={styles.img}
          />
        </View>

        <View style={styles.signUpContainer}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleSelectImage}>
            {avatar ? (
              <Image source={{uri: avatar}} style={styles.avatar} />
            ) : (
              <Ionicons name="camera-outline" size={24} color="black" />
            )}
          </TouchableOpacity>
          <View style={{marginBottom: 20}} />

          <Text style={styles.label}>Tên của bạn:</Text>
          <View style={styles.bodyContainer}>
            <Icon icon="User" size={30} style={styles.LoginIcon} />
            <TextInput
              placeholder="Nguyễn Văn A"
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={setFullName}
              value={fullName}
            />
          </View>

          <Text style={styles.label}>Email:</Text>
          <View style={styles.bodyContainer}>
            <Icon icon="Email" size={30} style={styles.LoginIcon} />
            <TextInput
              placeholder="name@gmail.com"
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
              placeholder="********"
              autoCapitalize="none"
              style={styles.textInput}
              secureTextEntry={pwdHidden}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setPwdHidden(!pwdHidden)}>
              <Ionicons
                name={pwdHidden ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                style={{width: 24, height: 24, color: 'gray'}}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nhập lại mật khẩu:</Text>
          <View style={styles.bodyContainer}>
            <Icon icon="Key" size={30} style={styles.LoginIcon} />
            <TextInput
              placeholder="********"
              autoCapitalize="none"
              style={styles.textInput}
              secureTextEntry={pwdHidden}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setPwdHidden(!pwdHidden)}>
              <Ionicons
                name={pwdHidden ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                style={{width: 24, height: 24, color: 'gray'}}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Số điện thoại và Tỉnh thành:</Text>
          <View style={styles.bodyContainerRow}>
            <View style={styles.phoneContainer}>
              <Icon icon="Phone" size={30} style={styles.LoginIcon} />
              <TextInput
                placeholder="0326..."
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={text => {
                  if (/^\d{0,10}$/.test(text)) {
                    setPhoneNumber(text);
                  }
                }}
                value={phoneNumber}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.addressContainer}>
              <Icon icon="Location" size={30} style={styles.LoginIcon} />
              <Picker
                selectedValue={address}
                onValueChange={itemValue => setAddress(itemValue)}
                style={styles.picker}>
                {provinces.map((province, index) => (
                  <Picker.Item key={index} label={province} value={province} />
                ))}
              </Picker>
            </View>
          </View>

          {/* <Text style={styles.label}>Số điện thoại:</Text>
          <View style={styles.bodyContainer}>
            <Icon icon="Phone" size={30} style={styles.LoginIcon} />
            <TextInput
              placeholder="0326..."
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={setPhoneNumber}
              value={phoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.label}>Địa chỉ:</Text>
          <View style={styles.bodyContainer}>
            <Icon icon="Location" size={30} style={styles.LoginIcon} />
            <Picker
              selectedValue={address}
              onValueChange={itemValue => setAddress(itemValue)}
              style={styles.picker}>
              {provinces.map((province, index) => (
                <Picker.Item key={index} label={province} value={province} />
              ))}
            </Picker>
          </View> */}

          <View style={styles.forgetPassContainer}>
            <TouchableOpacity
              style={{position: 'absolute', right: 0}}
              onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.forgetPassText}>Bạn đã có tài khoản?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.buttonLogin} onPress={handleSignUp}>
            <Text style={styles.buttonLoginText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7b70f9',
  },
  headerContainer: {
    marginLeft: 10,
    padding: 10,
  },
  signUpContainer: {
    height: '100%',
    backgroundColor: colors.light,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },
  icon: {
    backgroundColor: colors.green,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  imageBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  img: {
    width: 180,
    height: 150,
  },
  bodyContainer: {
    width: WINDOW_WIDTH - 40,
    height: 50,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
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
  eyeIconContainer: {
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 10,
  },
  buttonLoginText: {
    color: colors.white,
    fontSize: sizes.h3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    borderRadius: 50,
    zIndex: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  bodyContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between the elements
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
  },

  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%', // Adjust to take up 48% of the width
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },

  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%', // Adjust to take up 48% of the width
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },

  picker: {
    height: 50,
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
