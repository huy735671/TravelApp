import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../constants/theme';
import MainHeader from '../components/shared/MainHeader';
import ScreenHeader from '../components/shared/ScreenHeader';
import TopPlacesCorousel from '../components/Home/TopPlacesCorousel';
import {PLACES, TOP_PLACES} from '../data';
import SectionHeader from '../components/shared/SectionHeader';
import TripsList from '../components/Home/TripsList';
import ViewPlacesByRegion from '../components/Places/ViewPlacesByRegion';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <MainHeader title="TravelNest" />
      <ScreenHeader mainTitle="Nơi Khởi Đầu " secondTitle="Chuyến Đi Của Bạn" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <TopPlacesCorousel list={TOP_PLACES} />

        <SectionHeader
          title="Địa điểm khác"
          buttonTitle="See All"
          onPress={() => {}}
        />
        <TripsList list={PLACES} />
        <ViewPlacesByRegion  />
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
});
