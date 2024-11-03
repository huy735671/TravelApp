import React from 'react';
import { View, StyleSheet, StatusBar, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, sizes } from '../constants/theme';

export default LoginScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Chào mừng đến với TravelNest</Text>

        <View>
          <Image source={require('../../assets/images/booking.png')} style={styles.image} />
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.registerButtonText}>Đăng ký</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.alreadyText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.loginText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6666FF',
  },
  welcomeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontWeight: 'bold',
    fontSize: sizes.title,
    alignSelf: 'flex-start', 
    marginLeft: 20,        
    marginTop: 60,         
    color: '#ffffff',      
  },
  image: {
    marginTop: 100,
    width: 350,
    height: 350,
  },
  registerButton: {
    backgroundColor: colors.green,
    paddingVertical: 15,
    width: '90%', 
    borderRadius: 8,
    marginTop: 50,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: sizes.h2,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  alreadyText: {
    color: '#ffffff',
    fontSize: sizes.h3,
  },
  loginText: {
    color: '#FFFF33', 
    fontSize: sizes.h3,
    textDecorationLine: 'underline',
  },

});
