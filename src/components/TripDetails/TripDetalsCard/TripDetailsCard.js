import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import HotelsCarousel from './HotelsCarousel';
import Icon from '../../shared/Icon';
import Divider from '../../shared/Divider';
import SectionHeader from '../../shared/SectionHeader';
import RatingOverall from '../../shared/Rating/RatingOverall';
import Reviews from '../../Reviews/Reviews';
import { colors, sizes, spacing } from '../../../constants/theme';
import { useNavigation } from '@react-navigation/native';

const TripDetailsCard = ({ trip }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{trip.title}</Text>
        <View style={styles.location}>
          <Text style={styles.locationText}>{trip.location}</Text>
          <Icon icon="Location" size={24} style={styles.locationIcon} />
        </View>
      </View>

      <Divider style={styles.divider} />

      <ScrollView style={styles.scrollBox} showsVerticalScrollIndicator={false}>
        <RatingOverall rating={trip.rating} containerStyle={styles.rating} />

        <SectionHeader
          title="Giới thiệu"
          containerStyle={styles.SectionHeader}
          titleStyle={styles.sectionTitle}
          onPress={() => {}}
          buttonTitle="Tất cả"
        />

        <View style={styles.summary}>
          <Text style={styles.summaryText}>{trip.description}</Text>
        </View>

        <SectionHeader
          title="Khách sạn liên quan"
          containerStyle={styles.SectionHeader}
          titleStyle={styles.sectionTitle}
          onPress={() => navigation.navigate('AllHotels')}
          buttonTitle="Tất cả"
        />

        <HotelsCarousel hotels={trip.hotels || []} location={trip.location} />

        <SectionHeader
          title="Đánh giá"
          containerStyle={styles.sectionHeader}
          titleStyle={styles.sectionTitle}
          onPress={() => {}}
          buttonTitle="Tất cả"
        />
        <Reviews reviews={trip.reviews} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2.7,
    backgroundColor: colors.light, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    top: -20,
    
  },
  header: {
    paddingVertical: spacing.l -30,
    paddingHorizontal: spacing.l,
  },
  title: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: colors.primary, 
  },
  location: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationText: {
    fontSize: sizes.title,
    color: colors.primary,
  },
  locationIcon: {
    tintColor: colors.gray,
  },
  divider: {
    marginVertical: spacing.m,
  },
  scrollBox: {
    marginTop: spacing.s,
    marginBottom: spacing.m,
  },
  SectionHeader: {
    marginTop: spacing.m,
  },
  sectionTitle: {
    color: colors.lightGray,
    fontWeight: 'normal',
  },
  summary: {
    marginHorizontal: spacing.l,
  },
  summaryText: {
    color: colors.primary,
  },
  rating: {
    marginHorizontal: spacing.l,
  },
  sectionHeader: {
    marginTop: spacing.m,
  },
});

export default TripDetailsCard;
