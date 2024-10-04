import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Rating } from 'react-native-ratings'; // Sử dụng Rating thay vì AirbnbRating
import { colors } from '../../../constants/theme';
import {
  getCorrectRating,
  getFractionDigitsRating,
  getRatingLabel,
} from './utils';

const StarRating = ({
  showLabelInline = false,
  showLabelTop = false,
  containerStyle,
  rating,
  disabled = true,
  size = 12,
}) => {
  // Lấy giá trị rating chính xác
  const _rating = getCorrectRating(rating);
  const formattedRating = getFractionDigitsRating(_rating);

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        showLabelInline ? styles.containerRow : null,
      ]}>
      {showLabelTop && (
        <Text style={styles.label}>
          {getRatingLabel(_rating)} {formattedRating}
        </Text>
      )}
      <Rating
        type="star"
        imageSize={size}
        readonly={disabled}
        startingValue={_rating}
        ratingColor={colors.primary}
        ratingBackgroundColor={colors.lightGray}
      />
      {showLabelInline && (
        <Text style={styles.label}>{formattedRating}</Text>
      )}
    </View>
  );
};


// Thêm một số kiểu dáng
const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    alignItems: 'flex-end',
    marginHorizontal: -2,
  },
  containerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: colors.primary,
    marginLeft: 4,
  },
});

export default StarRating;
