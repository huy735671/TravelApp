import React, {useMemo} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import * as Animatable from 'react-native-animatable';
import BottomSheet from '@gorhom/bottom-sheet';
import {colors, sizes, spacing} from '../../constants/theme';
import CustomHandler from './CustomHandler';
import CustomBackground from './CustomBackground';

const TripDetailsCard = ({trip}) => {
  const snapPoints = useMemo(() => ['30%', '80%']);
  
  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      handleComponent={CustomHandler}
      backgroundComponent={CustomBackground}
      >
      
      <Animatable.View
        style={styles.header}
        animation="fadeInUp"
        delay={500}
        easing="ease-in-out"
        duration={400}>
        <Text style={styles.title}>{trip.title}</Text>
        <Text style={styles.location}>{trip.location}</Text>
      </Animatable.View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.l,
    paddingHorizontal: spacing.l,
  },
  title: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: colors.white,
  },
  location: {
    fontSize: sizes.title,
    color: colors.white,
  },
});

export default TripDetailsCard;
