import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {colors} from '../constants/theme';
import MainHeader from '../components/shared/MainHeader';
import ScreenHeader from '../components/shared/ScreenHeader';
import TopPlacesCorousel from '../components/Home/TopPlacesCorousel';
import {PLACES, TOP_PLACES} from '../data';
import SectionHeader from '../components/shared/SectionHeader';
import TripsList from '../components/Home/TripsList';
import ViewPlacesByRegion from '../components/Places/ViewPlacesByRegion';
import ExploreScreen from '../components/Places/ExploreScreen';

const HomeScreen = ({navigation}) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [100, 0], 
    extrapolate: 'clamp', 
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0], 
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <MainHeader title="TravelNest" />
      <Animated.View
        style={[
          styles.headerContainer,
          {height: headerHeight, opacity: headerOpacity},
        ]}>
        <ScreenHeader
          mainTitle="Nơi Khởi Đầu"
          secondTitle="Chuyến Đi Của Bạn"
        />
      </Animated.View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false}, 
        )}>
        <TopPlacesCorousel list={TOP_PLACES} />
        <ExploreScreen />
        
        <ViewPlacesByRegion />


        <SectionHeader
          title="Địa điểm khác"
          buttonTitle="Tất cả"
          onPress={() => {}}
        />

        <TripsList list={PLACES} />

      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  exploreButton: {
    padding: 15,
    backgroundColor: '#4c8d6e',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  exploreText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
