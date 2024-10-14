import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import CustomMenuContent from '../components/CustomMenuContent';
import AllHotelsScreen from '../screens/AllHotelsScreen';
import BookingHistoryScreen from '../screens/BookingHistoryScreen ';
import FavouriteScreen from '../screens/FavouriteScreen';

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
        name="BookingHistoryScreen"
        component={BookingHistoryScreen}
        options={{
          drawerLabel: 'Danh sách phòng đặt',
          headerTitle: 'Lịch sử đặt phòng',
          headerTitleAlign: 'center',
          // headerShown: false,
          useNativeDriver: true,
          gestureEnabled: false,
          headerStyle: {
            backgroundColor: '#4c8d6e',
          },
          headerTintColor: '#fff',
        }}
      />

      <Drawer.Screen
        name="Favourite"
        component={FavouriteScreen}
        options={{
          drawerLabel: 'Danh sách yêu thích',
          headerTitle: 'Danh sách yêu thích',
          headerTitleAlign: 'center',
          // headerShown: false,
          useNativeDriver: true,
          gestureEnabled: false,
          headerStyle: {
            backgroundColor: '#4c8d6e',
          },
          headerTintColor: '#fff',
        }}
      />
    </Drawer.Navigator>
  );
};

export default MenuNavigator;
