import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import SearchCard from '../Search/SearchCard';

const { width } = Dimensions.get('screen');

const LocationsScreen = () => {
  const [locations, setLocations] = useState([]); // Mảng khách sạn từ Firestore
  const [filterType, setFilterType] = useState('All'); // 'All', 'Business', 'Apartment'

  // Lấy dữ liệu khách sạn từ Firestore
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('hotels') // Thay 'hotels' bằng tên collection của bạn
      .onSnapshot(querySnapshot => {
        const hotels = [];
        querySnapshot.forEach(doc => {
          hotels.push({ id: doc.id, ...doc.data() });
        });
        setLocations(hotels);
      });

    return () => unsubscribe(); // Dọn dẹp khi component unmount
  }, []);

  // Hàm để lọc địa điểm dựa trên loại khách sạn
  const filteredLocations = locations.filter(location => {
    if (filterType === 'All') return true; // Hiển thị tất cả
    return location.hotelType === filterType; // Hiển thị theo loại đã chọn
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Chọn địa điểm</Text>

      <View style={styles.filtersContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterType('All')}>
          <Text style={styles.filterButtonText}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterType('Business')}>
          <Text style={styles.filterButtonText}>Business</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterType('Apartment')}>
          <Text style={styles.filterButtonText}>Apartment</Text>
        </TouchableOpacity>
      </View>

      {filteredLocations.length === 0 ? ( // Kiểm tra xem có địa điểm nào không
        <Text style={styles.noLocationText}>Không có địa điểm nào phù hợp.</Text>
      ) : (
        <FlatList
          data={filteredLocations}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => <SearchCard item={item} index={index} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.locationsList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#007BFF',
    borderRadius: 20,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noLocationText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
  locationsList: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
});

export default LocationsScreen;
