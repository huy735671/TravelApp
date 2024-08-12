import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {sizes, spacing} from '../../constants/theme';

const SectionHeader = ({
  title,
  onPress,
  containerStyle,
  titleStyle,
  buttonTitle = 'Button',
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {onPress && <Button title={buttonTitle} onPress={onPress}/> }
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.l,
    marginBottom: 10,
    marginLeft: spacing.l,
    marginRight: spacing.m,
  },
  title: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
  },
});
