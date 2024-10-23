import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {shadow, sizes} from '../../constants/theme';

const ProfileHeader = () => {
  const [userData, setUserData] = useState(null); // State để lưu thông tin người dùng

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userSnapshot = await firestore()
            .collection('users')
            .doc(currentUser.email) // Lấy thông tin dựa trên UID của người dùng
            .get();

          if (userSnapshot.exists) {
            setUserData(userSnapshot.data()); // Lưu dữ liệu người dùng
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.profile}>
      <Image
        source={
          userData && userData.avatarUrl
            ? {uri: userData.avatarUrl} // Hiển thị ảnh đại diện từ URL
            : require('../../../assets/images/users/35.jpeg') // Ảnh mặc định
        }
        style={styles.profileAvatar}
      />
      <View style={styles.proFileNameContainer}>
        <Text style={styles.profileName}>
          {userData ? userData.username : 'Nguyễn Văn A'}{' '}
         
        </Text>
        <Text style={styles.profileEmail}>
          {userData ? userData.email : 'avannguyen@gmail.com'}
        </Text>
       
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  profile: {
    height: 280,
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#003b95',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
    elevation: 10,
    ...shadow.light,
    flexDirection: 'column',
    backgroundColor:'#4c8d6e',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 9999,
    marginBottom: 16, 
  },
  proFileNameContainer: {
    alignItems: 'center', 
  },
  profileName: {
    fontSize: sizes.title,
    fontWeight: '700',
    color: '#ffffff', 
  },
  profileEmail: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '400',
    color: '#d1d1d1',
  },
  
});

export default ProfileHeader;
