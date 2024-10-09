import React from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import ProfileHeader from './Profile/ProfileHeader';

const CustomMenuContent = props => {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="#4c8d6e"
      />
      <View style={styles.profileHeader}>
        <ProfileHeader />
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader:{
    height: 270,
    backgroundColor: '#4c8d6e', 
    justifyContent: 'center',
  },
});

export default CustomMenuContent;
