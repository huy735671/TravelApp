import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../constants/theme';
import MainHeader from '../components/shared/MainHeader';
import SearchInput from '../components/Search/SearchInput';
import Tabs from '../components/shared/Tabs';
import SearchMasonry from '../components/Search/SearchMasonry';
import firestore from '@react-native-firebase/firestore';

const SearchScreen = () => {
  const [places, setPlaces] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [allData, setAllData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy dữ liệu từ collection 'places'
        const placesSnapshot = await firestore().collection('places').get();
        const placesData = placesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Lấy dữ liệu từ collection 'hotels'
        const hotelsSnapshot = await firestore().collection('hotels').get();
        const hotelsData = hotelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Kết hợp dữ liệu từ cả hai collection
        setPlaces(placesData);
        setHotels(hotelsData);
        setAllData([...placesData, ...hotelsData]);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const filteredData = allData.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) || // Tìm theo title
      item.location.toLowerCase().includes(searchLower) // Tìm theo location
    );
  });

  const tabs = [
    {
      title: 'All',
      content: () => <SearchMasonry key="all" list={filteredData} />, // Dùng filteredData cho tab 'All'
    },
    {
      title: 'Places',
      content: () => <SearchMasonry key="places" list={places.filter(place => place.title.toLowerCase().includes(searchTerm.toLowerCase()))} />, // Lọc theo tìm kiếm cho tab 'Places'
    },
    {
      title: 'Hotels',
      content: () => <SearchMasonry key="hotels" list={hotels.filter(hotel => hotel.title.toLowerCase().includes(searchTerm.toLowerCase()))} />, // Lọc theo tìm kiếm cho tab 'Hotels'
    },
  ];

  return (
    <View style={styles.container}>
      <MainHeader title="Search" />
      <SearchInput onSearch={setSearchTerm} />
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
