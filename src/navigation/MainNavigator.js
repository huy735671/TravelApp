import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import TripDetailsScreen from '../screens/TripDetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import MenuNavigator from './MenuNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import HotelDetailsScreen from '../screens/HotelDetailsScreen';
import ListHotelDetails from '../components/Hotels/ListHotelDetails';
import HotelListType from '../components/Hotels/HotelListType';
import RegionListScreen from '../components/Places/RegionListScreen';
import AddReviewScreen from '../components/Reviews/AddReviewScreen';
import AllReviews from '../components/Reviews/AllReviews';
import BookingScreen from '../components/Hotels/BookingScreen';
import ReviewSection from '../components/Reviews/Hotels/ReviewSection';
import AllReviewHotel from '../components/Reviews/Hotels/AllReviewHotel';
import {CardStyleInterpolators} from '@react-navigation/stack';
import PlaceDetailScreen from '../screens/PlaceDetailScreen';
import BookingDetail from '../components/shared/BookingDetail';
import RegionFilter from '../components/Places/regions';
import SearchResultsScreen from '../components/Search/Hotel/SearchResultsScreen';
import SpecialOfferDetails from '../components/Hotels/HotelHome/SpecialOfferDetails';
import ResetPw from '../components/SignInUp/ResetPw';
import BookingSuccessScreen from '../components/Hotels/BookingSuccessScreen';
import TourDetail from '../components/Tour/TourDetail';
import SignUp from '../components/SignInUp/SignUp';
import Login from '../components/SignInUp/Login';

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
          name="SignUp"
          component={SignUp}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />

<Stack.Screen
          name="SignIn"
          component={Login}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
            headerShown: true,
            headerTitle: 'Chỉnh sửa hồ sơ',
            useNativeDriver: true,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="HotelDetails"
          component={HotelDetailsScreen}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />

        <Stack.Screen
          name="PlaceDetail"
          component={PlaceDetailScreen}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            // transitionSpec: {
            //   open: {
            //     animation: 'timing',
            //     config: {
            //       duration: 500, // Thời gian hiệu ứng
            //     },
            //   },
            //   close: {
            //     animation: 'timing',
            //     config: {
            //       duration: 500,
            //     },
            //   },
            // },
          }}
        />
        <Stack.Screen
          name="ListHotelDetails"
          component={ListHotelDetails}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="HotelListType"
          component={HotelListType}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="RegionListScreen"
          component={RegionListScreen}
          options={{
            headerShown: true,
            headerTitle: 'Danh sách địa điểm đề xuất',
            useNativeDriver: true,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: '#fff',
          }}
        />

        <Stack.Screen
          name="AddReview"
          component={AddReviewScreen}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
        />

        <Stack.Screen
          name="AllReviews"
          component={AllReviews}
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
          name="BookingScreen"
          component={BookingScreen}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 500, 
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 500,
                },
              },
            },
          }}
        />

        <Stack.Screen
          name="ReviewSection"
          component={ReviewSection}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />

        <Stack.Screen
          name="AllReviewHotel"
          component={AllReviewHotel}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />

        <Stack.Screen
          name="BookingDetail"
          component={BookingDetail}
          options={{
            headerTitle: 'Chi Tiết đặt phòng',
            headerShown: true,
            useNativeDriver: true,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />

        <Stack.Screen
          name="RegionFilter"
          component={RegionFilter}
          options={{
            headerShown: true,
            useNativeDriver: true,
            gestureEnabled: true,
            headerTitle: 'Khám phá Việt Nam',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: '#fff',
          }}
        />

        <Stack.Screen
          name="SearchResults"
          component={SearchResultsScreen}
          options={{
            headerShown: true,
            useNativeDriver: true,
            gestureEnabled: true,
            headerTitle: 'Tìm Khách Sạn',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: '#fff',
          }}
        />

        <Stack.Screen
          name="SpecialOfferDetails"
          component={SpecialOfferDetails}
          options={{
            headerShown: true,
            useNativeDriver: true,
            gestureEnabled: true,
            headerTitle: 'Ưu đãi đặc biệt',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: '#fff',
          }}
        />

        <Stack.Screen
          name="ResetPw"
          component={ResetPw}
          options={{
            headerShown: true,
            useNativeDriver: true,
            gestureEnabled: true,
            headerTitle: 'Đặt lại mật khẩu',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: '#fff',
          }}
        />

        <Stack.Screen
          name="BookingSuccess"
          component={BookingSuccessScreen}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: true,

            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: '#fff',
          }}
        />

        <Stack.Screen
          name="TourDetail"
          component={TourDetail}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
