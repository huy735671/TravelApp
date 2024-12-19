import React from 'react';
import {View, StyleSheet, StatusBar, TouchableOpacity, Text} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import ProfileHeader from './Profile/ProfileHeader';
import auth from '@react-native-firebase/auth'; // Để xử lý đăng xuất
import {useNavigation} from '@react-navigation/native';

const CustomMenuContent = props => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Login'); // Đưa người dùng về màn hình đăng nhập sau khi đăng xuất
    } catch (error) {
      console.error('Lỗi khi đăng xuất: ', error);
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="#4c8d6e" />
      
      <View style={styles.profileHeader}>
        <ProfileHeader />
      </View>

      <DrawerItemList {...props} />

      {/* Nút Đăng Xuất */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    height: 270,
    backgroundColor: '#4c8d6e',
    justifyContent: 'center',
  },
  logoutButton: {
    marginTop: 'auto',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  logoutButtonText: {
    fontSize: 18,
    color: 'red',

  },
});

export default CustomMenuContent;
