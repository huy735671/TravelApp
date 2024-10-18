import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {colors, shadow, sizes, spacing} from '../../../constants/theme';
import Icon from '../../shared/Icon';

const SearchBar = ({navigation}) => {
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    // Chuyển hướng sang trang tìm kiếm và truyền địa chỉ người dùng nhập
    if (location) {
      navigation.navigate('SearchResults', {location});
    }
  };

  return (
    <View style={styles.searchBarContainer}>
      <Text style={styles.searchTitle}>Tìm chỗ nghỉ lý tưởng</Text>

      <View style={styles.inner}>
        <View style={styles.search} pointerEvents="none">
          <Icon icon="Location" />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Bạn muốn đi đâu?"
          value={location}
          onChangeText={setLocation}
        />
      </View>
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Tìm kiếm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.l,
    paddingBottom: spacing.l / 1.5,
  },
  inner: {
    flexDirection: 'row',
    marginVertical:10,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
  },
  search: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  searchInput: {
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
  searchButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center', // Canh giữa nút
    borderRadius:sizes.radius,
    marginTop:5,
  },
  searchButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default SearchBar;
