import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from './Icon';
import {colors, sizes, spacing} from '../../constants/theme';
import {useNavigation} from '@react-navigation/native';

const MainHeader = ({title}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, {marginTop: insets.top}]}>
      <Icon
        icon="Hamburger"
        size={40}
        color={colors.light}
        onPress={() => {
          navigation.openDrawer();
        }}
      />
      <Text style={styles.title}>{title}</Text>
      <Icon
        icon="Notification"
        size={40}
        color={colors.light}
        onPress={() => {}}
      />
    </View>
  );
};

export default MainHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    backgroundColor: '#4c8d6e',
  },
  title: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.light,
  },
});
