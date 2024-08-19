import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import ProfileHeader from './Profile/ProfileHeader';

const CustomMenuContent = (props) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <ProfileHeader />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CustomMenuContent;
