import {Text, View, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar} from 'react-native';
import {colors, sizes, spacing} from '../../constants/theme';
import Icon from '../shared/Icon';
import StarRating from '../shared/Rating/Rating';

const HotelDetailsCarousel = ({hotel}) => {
  if (!hotel) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <Image source={{uri: hotel.imageUrl}} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon icon="Location" size={28} />
        </View>
        <View style={{marginTop: 20, paddingHorizontal: 20}}>
          <Text style={styles.title}>{hotel.hotelName}</Text>
          <Text style={styles.location}>{hotel.location}</Text>
          <View style={{marginTop: 5}}>
            <StarRating
              showLabelInline
              rating={hotel.rating}
              size={20}
              containerStyle={styles.rating}
            />
          </View>

          <Text style={styles.description}>{hotel.description}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>Per Night</Text>
          <View style={styles.priceTag}>
            <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 5}}>
            {hotel.pricePerNight} VND
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.btnContainer}>
          <Text style={styles.btnText}>Book now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 300,
    resizeMode: 'cover',
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  content: {},
  title: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.primary,
  },
  location: {
    fontSize: sizes.body,
    fontWeight: '400',
    color: colors.gray,
    marginTop: 5,
  },
  priceContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
  },
  priceText: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: spacing.s,
  },
  priceTag: {
    height: 40,
    alignItems: 'center',
    marginLeft: 40,
    paddingLeft: 20,
    flex: 1,
    backgroundColor: '#c9dcda',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    flexDirection: 'row',
  },
  description: {
    lineHeight: 20,
    fontSize: sizes.body + 1,
    color: colors.gray,
    marginTop: spacing.s,
  },
  iconContainer: {
    position: 'absolute',
    height: 60,
    width: 60,
    backgroundColor: '#66e4d4',
    top: -30,
    right: 20,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    backgroundColor: '#66e4d4',
    borderRadius: 10,
    marginHorizontal: 20,
  },
  btnText: {
    color: colors.light,
    fontSize: sizes.h3,
    fontWeight: 'bold',
  },
});

export default HotelDetailsCarousel;
