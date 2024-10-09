import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import TripDetailsScreen from '../screens/TripDetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import MenuNavigator from './MenuNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import HotelDetailsScreen from '../screens/HotelDetailsScreen';
import ListHotelDetails from '../components/Hotels/ListHotelDetails';
import HotelListType from '../components/Hotels/HotelListType';

const Stack = createSharedElementStackNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Root"
          component={MenuNavigator}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="TripDetails"
          component={TripDetailsScreen}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: false,
            cardStyleInterpolator: ({current: {progress}}) => ({
              cardStyle: {
                opacity: progress,
              },
            }),
          }}
        />

        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: false,
            cardStyleInterpolator: ({current: {progress}}) => ({
              cardStyle: {
                opacity: progress,
              },
            }),
          }}
        />

        <Stack.Screen
          name="HotelDetails"
          component={HotelDetailsScreen}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: false,
            cardStyleInterpolator: ({current: {progress}}) => ({
              cardStyle: {
                opacity: progress,
              },
            }),
          }}
        />

        <Stack.Screen
          name="ListHotelDetails"
          component={ListHotelDetails}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: false,
            cardStyleInterpolator: ({current: {progress}}) => ({
              cardStyle: {
                opacity: progress,
              },
            }),
          }}
        />

        <Stack.Screen
          name="HotelListType"
          component={HotelListType}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: false,
            cardStyleInterpolator: ({current: {progress}}) => ({
              cardStyle: {
                opacity: progress,
              },
            }),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
