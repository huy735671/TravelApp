import {StyleSheet, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import Icon from '../shared/Icon';
import {colors, shadow, sizes, spacing} from '../../constants/theme';

const SearchInput = ({onSearch}) => {
  const [search, setSearch] = useState('');

  const handleSearchChange = (text) => {
    setSearch(text);
    onSearch(text); // Gọi hàm onSearch mỗi khi người dùng nhập vào ô tìm kiếm
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.search} pointerEvents="none">
          <Icon icon="Search" />
        </View>
        <TextInput
          style={styles.field}
          placeholder="Search"
          value={search}
          onChangeText={handleSearchChange}
        />
        <View style={styles.filter}>
          <Icon icon="Filter" onPress={() => {}} />
        </View>
      </View>
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.l,
    paddingBottom: spacing.l / 1.5,
  },
  inner: {
    flexDirection: 'row',
  },
  search: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  field: {
    backgroundColor: colors.white,
    paddingLeft: spacing.xl + spacing.s,
    paddingRight: spacing.m,
    paddingVertical: spacing.m,
    borderRadius: sizes.radius,
    height: 54,
    flex: 1,
    elevation: 5,
    ...shadow.light,
  },
  filter: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});
