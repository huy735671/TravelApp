import React from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import {shadow} from '../../constants/theme';

const ProfileHeader = () => {
  return (
    <View style={styles.profile}>
      <Image
        source={require('../../../assets/images/users/35.jpeg')}
        style={styles.profileAvatar}
      />
      <View style={styles.proFileNameContainer}>
        <Text style={styles.profileName}>Nguyễn Văn A</Text>
        <Text style={styles.profileEmail}>Xem hồ sơ</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profile: {
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
    elevation: 10,
    ...shadow.light,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
  },
  proFileNameContainer: {
    marginLeft: 16,
  },
  profileName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '600',
    color: '#090909',
  },
  profileEmail: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '400',
    color: '#848484',
  },
});

export default ProfileHeader;
