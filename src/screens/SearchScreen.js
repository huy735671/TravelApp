import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../constants/theme';
import MainHeader from '../components/shared/MainHeader';
import SearchInput from '../components/Search/SearchInput';
import Tabs from '../components/shared/Tabs';
import {SEARCH_ALL, SEARCH_HOTELS, SEARCH_PLACES} from '../data';
import SearchMasonry from '../components/Search/SearchMasonry';


const tabs = [
  {
    title: 'All',
    content: () => <SearchMasonry key="all" list={SEARCH_ALL} />,
  },
  {
    title: 'Places',
    content: () => <SearchMasonry key="places" list={SEARCH_PLACES} />,
  },
  {
    title: 'Hotels',
    content: () => <SearchMasonry key="hotels" list={SEARCH_HOTELS} />,
  },
];

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <MainHeader title="Search" />

      <SearchInput />
      <Tabs items={tabs} />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
});
