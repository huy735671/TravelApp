import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from '../shared/Icon';
import {colors} from '../../constants/theme';

const AddButton = ({onPress}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={onPress}>
        <Icon icon="Add" size={40} style={{tintColor: colors.white}} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: colors.dark,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});

export default AddButton;
