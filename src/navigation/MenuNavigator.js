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
          drawerLabel: 'Home',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="AllHotels"
        component={AllHotelsScreen}
        options={{
          drawerLabel: 'All Hotels',
          headerShown: false,
          useNativeDriver: true,
          gestureEnabled: false,
        }}
      />
      <Drawer.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{drawerLabel: 'Favorite'}}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{drawerLabel: 'Settings'}}
      />
    </Drawer.Navigator>
  );
};

export default MenuNavigator;
