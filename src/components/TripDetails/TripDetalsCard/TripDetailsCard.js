import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import HotelsCarousel from './HotelsCarousel';
import Icon from '../../shared/Icon';
import Divider from '../../shared/Divider';
import SectionHeader from '../../shared/SectionHeader';
import RatingOverall from '../../shared/Rating/RatingOverall';
import Reviews from '../../Reviews/Reviews';
import {colors, sizes, spacing} from '../../../constants/theme';
import {useNavigation} from '@react-navigation/native';
import RelatedLocations from './RelatedLocations';

const TripDetailsCard = ({trip}) => {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false); // Trạng thái để xác định card có mở rộng hay không
  const heightAnim = useRef(new Animated.Value(480)).current; // Giá trị Animated cho chiều cao

  // Hàm để chuyển đổi giữa chiều cao 480 và 750
  const toggleExpand = () => {
    Animated.timing(heightAnim, {
      toValue: expanded ? 480 : 780, // Chuyển giữa 480 và 750
      duration: 300, // Thời gian animation
      useNativeDriver: false, // Không sử dụng native driver cho chiều cao
    }).start();
    setExpanded(!expanded); // Đảo trạng thái mở rộng
  };

  return (
    <Animated.View style={[styles.container, {height: heightAnim}]}>
      <View style={styles.header}>
        <Text style={styles.title}>{trip.title}</Text>
        <View style={styles.location}>
          <Text style={styles.locationText}>{trip.location}</Text>
          {/* <Icon icon="Location" size={24} style={styles.locationIcon} /> */}
          <TouchableOpacity style={styles.toggleButton} onPress={toggleExpand}>
            <Text style={styles.toggleButtonText}>
              {expanded ? 'Thu gọn' : 'Mở rộng'}
            </Text>
          </TouchableOpacity>
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
        <SectionHeader
          title="Địa điểm liên quan"
          containerStyle={styles.sectionHeader}
          titleStyle={styles.sectionTitle}
          onPress={() => {}}
          buttonTitle="Tất cả"
        />
        <RelatedLocations location={trip.location} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    top: -20,
  },
  header: {
    paddingVertical: spacing.l - 30,
    paddingHorizontal: spacing.l,
  },
  title: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: colors.primary,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center', // Căn giữa các phần tử theo chiều dọc
    justifyContent: 'space-between',
  },
  locationText: {
    fontSize: sizes.title,
    color: colors.primary,
  },
  locationIcon: {
    tintColor: colors.gray,
    marginHorizontal: 5, // Khoảng cách giữa chữ địa điểm và icon
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
  toggleButton: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  toggleButtonText: {
    color: colors.light,
    fontWeight: 'bold',
  },
});

export default TripDetailsCard;
