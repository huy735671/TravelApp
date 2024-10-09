import React, {useState} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import LoginHome from '../components/SignInUp/LoginHeader';
import Login from '../components/SignInUp/Login';
import FooterLogin from '../components/SignInUp/FooterLogin';
import SignUp from '../components/SignInUp/SignUp';
const SIGN_IN = 'SIGN_IN';
const SIGN_UP = 'SIGN_UP';
export default LoginScreen = ({navigation}) => {
  const [page, setPage] = useState('SIGN_IN');

  return (
    <View style={{width: '100%', height: '100%'}}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <View style={{width: '100%', height: '25%'}}>
        <LoginHome page={page} setPage={setPage} />
      </View>
      <View style={{height: '60%', width: '100%', backgroundColor: '#eeeeee',}}>
        {page === SIGN_IN ? <Login /> : <SignUp/>}
      </View>
      <View style={{flex: 1}}>
        <FooterLogin />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
