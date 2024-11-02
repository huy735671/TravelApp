import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {colors, shadow, sizes, spacing} from '../../constants/theme';
import * as Animatable from 'react-native-animatable';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from '../shared/Icon';
import {useNavigation} from '@react-navigation/native';
import FavoriteButton from '../shared/FavoriteButton';

const {width} = Dimensions.get('window');

const TourDetail = ({route}) => {
  const {tourId} = route.params || {};
  const [tourDetail, setTourDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [expandedSections, setExpandedSections] = useState({
    itinerary: false,
    guide: false,
    cancellationPolicy: false,
  });

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        const doc = await firestore().collection('tours').doc(tourId).get();
        if (doc.exists) {
          setTourDetail({id: doc.id, ...doc.data()});
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching tour details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (tourId) {
      fetchTourDetail();
    }
  }, [tourId]);

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (!tourDetail) {
    return <Text style={styles.errorText}>Tour not found</Text>;
  }

  const defaultImage =
    'https://quangbinhgo.com/wp-content/uploads/2020/11/kinh-nghiem-du-lich-theo-tour-lu-hanh.jpg';
  const images =
    tourDetail.images && tourDetail.images.length > 0
      ? tourDetail.images
      : [defaultImage];

  const toggleSection = section => {
    setExpandedSections(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const formatDate = date => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const formatPrice = price => {
    const numberPrice = typeof price === 'number' ? price : parseFloat(price);
    return numberPrice.toLocaleString('vi-VN') + 'đ/người';
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
     
        <Animatable.View
          style={[styles.backButton, {marginTop: insets.top}]}
          animation="fadeIn"
          delay={500}
          duration={400}
          easing="ease-in-out">
          <Icon
            icon="Back"
            style={styles.backIcon}
            onPress={navigation.goBack}
          />
        </Animatable.View>

        <Animatable.View
          style={[styles.favoriteButton, {marginTop: insets.top}]}
          animation="fadeIn"
          delay={500}
          duration={400}
          easing="ease-in-out">
          <FavoriteButton />
        </Animatable.View>
   
      <ScrollView>
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <Image
              source={{uri: item}}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageList}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.tourName}>{tourDetail.name}</Text>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.dateContainer}>
              <Icon icon="calendar" size={20} color={colors.primary} />
              <Text style={styles.dateText}>
                {formatDate(tourDetail.startDate)} -{' '}
                {formatDate(tourDetail.endDate)}
              </Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{tourDetail.duration} </Text>
            </View>
          </View>
          <Text style={styles.tourPrice}>{formatPrice(tourDetail.price)}</Text>

          <View style={styles.infoContainer}>
            <Text style={styles.tourName}>Thông tin chuyến đi</Text>
            <View style={{flexDirection: 'row'}}>
              <Icon icon="Location" size={25} color={colors.primary} />
              <Text style={styles.tourDescription}>
                Khởi hành: {tourDetail.departure}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Icon icon="Location" size={25} color={colors.primary} />
              <Text style={styles.tourDescription}>
                Điểm đến: {tourDetail.destination}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Icon icon="Car" size={25} color={colors.primary} />
              <Text style={styles.tourDescription}>
                Phương tiện: {tourDetail.transportation}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Icon icon="Food" size={20} color={colors.primary} />
              <Text style={styles.tourDescription}>
                Bữa ăn: {tourDetail.meals}
              </Text>
            </View>
          </View>

          <View style={styles.bodyContainer}>
            <Text style={styles.tourName}>Mô tả tour</Text>
            <Text style={styles.tourDescription}>{tourDetail.description}</Text>

            <TouchableOpacity
              onPress={() => toggleSection('itinerary')}
              style={styles.sectionHeader}>
              <Text style={styles.tourName}>Lịch trình</Text>
              <Icon
                icon={expandedSections.itinerary ? 'arrowTop' : 'arrowBottom'}
                size={30}
                color={colors.primary}
              />
            </TouchableOpacity>

            {expandedSections.itinerary && (
              <Text style={styles.tourDescription}>{tourDetail.itinerary}</Text>
            )}
            <View
              style={{borderWidth: 0.7, borderColor: '#ddd', marginVertical: 5}}
            />
            <TouchableOpacity
              onPress={() => toggleSection('guide')}
              style={styles.sectionHeader}>
              <Text style={styles.tourName}>Hướng dẫn viên</Text>
              <Icon
                icon={expandedSections.guide ? 'arrowTop' : 'arrowBottom'}
                size={30}
                color={colors.primary}
              />
            </TouchableOpacity>
            {expandedSections.guide && (
              <Text style={styles.tourDescription}>{tourDetail.guide}</Text>
            )}
            <View
              style={{borderWidth: 0.7, borderColor: '#ddd', marginVertical: 5}}
            />

            <TouchableOpacity
              onPress={() => toggleSection('cancellationPolicy')}
              style={styles.sectionHeader}>
              <Text style={styles.tourName}>Chính sách hủy tour</Text>
              <Icon
                icon={
                  expandedSections.cancellationPolicy
                    ? 'arrowTop'
                    : 'arrowBottom'
                }
                size={30}
                color={colors.primary}
              />
            </TouchableOpacity>
            {expandedSections.cancellationPolicy && (
              <Text style={styles.tourDescription}>
                {tourDetail.cancellationPolicy}
              </Text>
            )}

            <View
              style={{borderWidth: 0.7, borderColor: '#ddd', marginVertical: 5}}
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.tourName}>Liên hệ</Text>
            <Text style={styles.tourDescription}>
              Số điện thoại: {tourDetail.contact}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: colors.danger,
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    left: spacing.l,
    zIndex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    right: spacing.l,
    zIndex: 1,
  },
  backIcon: {
    backgroundColor: colors.white,
    padding: 4,
    borderRadius: sizes.radius,
    ...shadow.light,
  },
  image: {
    width: width,
    height: 200,
  },
  imageList: {},
  detailsContainer: {
    padding: 10,
  },
  tourName: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
    backgroundColor: '#f6f6f7',
    alignSelf: 'flex-start',
    padding: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 20,
  },
  dateText: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: 8,
  },
  tourPrice: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  infoContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    marginTop: 10,
  },
  tourDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.primary,
    marginBottom: 10,
  },
  bodyContainer: {
    marginTop: 10,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default TourDetail;
