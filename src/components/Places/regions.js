import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { colors, shadow, sizes, spacing } from '../../constants/theme';
import Icon from '../shared/Icon';
import { useNavigation } from '@react-navigation/native';

const regions = ['Miền Bắc', 'Miền Trung', 'Miền Nam'];

const RegionFilter = () => {
  const [selectedRegion, setSelectedRegion] = useState('Miền Trung');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const placesData = [];
        const snapshot = await firestore().collection('places').get();
        snapshot.forEach(doc => {
          placesData.push({ id: doc.id, ...doc.data() });
        });
        setPlaces(placesData);
      } catch (error) {
        console.error('Error fetching places: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const filteredPlaces = places.filter(
    place =>
      place.region === selectedRegion &&
      (place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       place.location.toLowerCase().includes(searchTerm.toLowerCase())) // Thêm điều kiện lọc cho location
  );

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#007BFF"
        style={styles.loadingIndicator}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.search} pointerEvents="none">
          <Icon icon="Search" />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm địa điểm..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <View style={styles.filter}>
          <Icon icon="Filter" onPress={() => {}} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {regions.map(region => (
          <TouchableOpacity
            key={region}
            style={[
              styles.button,
              selectedRegion === region && styles.selectedButton,
            ]}
            onPress={() => setSelectedRegion(region)}>
            <Text style={styles.buttonText}>{region}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredPlaces}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.placeItem}
            onPress={() => navigation.navigate('TripDetails', { trip: item })}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.placeTitle}>{item.title}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.starRating}>⭐ {item.starRating}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inner: {
    flexDirection: 'row',
    paddingBottom: 10,
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
  filter: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 10,
    borderColor: '#ddd',
    borderTopWidth: 1,
    padding: 5,
  },
  button: {
    padding: 10,
    borderRadius: 10,
  },
  selectedButton: {
    backgroundColor: '#ffffff',
    elevation: 5,
    ...shadow.light,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  placeItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  placeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    color: '#555',
  },
  starRating: {
    fontSize: 16,
    color: '#FFD700',
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RegionFilter;
