import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FavoriteScreen from '../screens/BookingHistoryScreen ';
import Icon from '../components/shared/Icon';
import {colors, sizes} from '../constants/theme';
import {StyleSheet, Animated, View, TouchableOpacity} from 'react-native';
import HomeNavigator from './HomeNavigator';
import UserScreen from '../screens/UserScreen';
import SearchNavigator from './SearchNavigator';

import OffersScreen from '../screens/OffersScreen';

const tabs = [
  {
    name: 'Home',
    screen: HomeNavigator,
  },
  {
    name: 'Search',
    screen: SearchNavigator,
  },
  
  {
    name: 'Graph',
    screen: OffersScreen,
  },
  {
    name: 'User',
    screen: UserScreen,
  },
];

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const offsetAnimation = React.useRef(new Animated.Value(0)).current;
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}>
        {tabs.map(({name, screen}, index) => {
          return (
            <Tab.Screen
              key={name}
              name={name}
              component={screen}
              options={{
                tabBarIcon: ({focused}) => {
                  return (
                    <Icon
                      icon={name}
                      size={40}
                      style={{
                        tintColor: focused ? colors.primary : colors.gray,
                      }}
                    />
                  );
                },
                
              }}
              listeners={{
                focus: () => {
                  Animated.spring(offsetAnimation, {
                    toValue: index * (sizes.width / tabs.length),
                    useNativeDriver: true,
                  }).start();
                },
              }}
            />
          );
        })}


      </Tab.Navigator>

      

      <Animated.View
        style={[
          styles.indicator,
          {
            transform: [
              {
                translateX: offsetAnimation,
              },
            ],
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
 
  indicator: {
    position: 'absolute',
    width: 20,
    height: 2,
    left: sizes.width / tabs.length / 2 - 10,
    bottom: 45,
    backgroundColor: colors.primary,
    zIndex: 100,
  },
  
});

export default TabNavigator;
