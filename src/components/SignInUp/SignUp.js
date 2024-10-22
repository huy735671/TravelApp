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
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pwdHidden, setPwdHidden] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.titleHeader}>...</Text>

      <View style={styles.bodyContainer}>
        <FontAwesome name="user" size={30} style={styles.LoginIcon} />

        <TextInput
          placeholder="Nhập tên của bạn"
          autoCapitalize={false}
          style={styles.textInput}
          onChange={setEmail}
          value={email}
        />
      </View>

      <View style={styles.bodyContainer}>
        <Icons name="email" size={30} style={styles.LoginIcon} />

        <TextInput
          placeholder="Địa chỉ email  "
          autoCapitalize={false}
          style={styles.textInput}
          onChange={setEmail}
          value={email}
        />
      </View>

      <View style={styles.bodyContainer}>
        <Ionicons name="lock-closed" size={30} style={styles.LoginIcon} />
        <TextInput
          placeholder="Mật khẩu"
          autoCapitalize={false}
          style={styles.textInput}
          secureTextEntry={pwdHidden}
          onChange={setPassword}
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

      <View style={styles.bodyContainer}>
        <Ionicons name="lock-closed" size={30} style={styles.LoginIcon} />
        <TextInput
          placeholder="Nhập lại mật khẩu"
          autoCapitalize={false}
          style={styles.textInput}
          secureTextEntry={pwdHidden}
          onChange={setPassword}
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

      <View style={styles.bodyContainer}>
        <Ionicons name="phone-portrait" size={30} style={styles.LoginIcon} />

        <TextInput
          placeholder="Số điện thoại"
          autoCapitalize={false}
          style={styles.textInput}
          onChange={setEmail}
          value={email}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.forgetPassContainer}>
        <TouchableOpacity style={{position: 'absolute', right: 0}}>
          <Text style={styles.forgetPassText}>Bạn đã có tài khoản ?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buttonLogin}>
        <Text style={styles.buttonLoginText}>Đăng ký</Text>
      </TouchableOpacity>

      <View></View>
    </View>
  );
};

export default SignUp;

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
    width: WINDOW_WIDTH - 40,
    height: 50,
    marginLeft: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius:20,

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
});
