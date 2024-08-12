import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from './Icon';
import { sizes, spacing } from '../../constants/theme';

const MainHeader = ({title}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, {marginTop: insets.top}]}>
      <Icon icon="Hamburger" onPress={(
        
      )=>{}}/>
      <Text style={styles.title}>{title}</Text>
      <Icon icon="Notification" onPress={()=>{}}/>
        
    </View>
  );
};

export default MainHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal: spacing.l,
  },
  title:{
    fontSize: sizes.h3,
    fontWeight:'bold',
    color:'black',
  },
});
