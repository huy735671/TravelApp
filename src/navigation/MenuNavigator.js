import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import CustomMenuContent from '../components/CustomMenuContent';
import FavoriteScreen from '../screens/FavoriteScreen';
import AllHotelsScreen from '../screens/AllHotelsScreen';

const Drawer = createDrawerNavigator();

const MenuNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={props => <CustomMenuContent {...props} />}>
      <Drawer.Screen
        name="HomeTabs"
        component={TabNavigator}
        options={{
          drawerLabel: 'Trang chủ địa điểm',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="AllHotels"
        component={AllHotelsScreen}
        options={{
          drawerLabel: 'Trang chủ khách sạn',
          headerShown: false,
          useNativeDriver: true,
          gestureEnabled: false,
        }}
      />
      <Drawer.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{drawerLabel: 'Danh sách yêu thích'}}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{drawerLabel: 'Cài đặt'}}
      />
    </Drawer.Navigator>
  );
};

export default MenuNavigator;
