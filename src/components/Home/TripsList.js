import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { colors, sizes, spacing } from '../../constants/theme';
import FavoriteButton from '../shared/FavoriteButton';
import { useNavigation } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import Card from '../shared/Card/card';
import CardMedia from '../shared/Card/CardMedia';
import CardContent from '../shared/Card/CardContent';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

const CARD_WIDTH = sizes.width / 2 - (spacing.l + spacing.l / 2);
const CARD_HEIGHT = 220;

const FILTER_OPTIONS = [
  { label: 'Bãi biển', type: 'beach', icon: 'sunny' },
  { label: 'Núi', type: 'mountain', icon: 'arrow-up-circle' },
  { label: 'Thành phố', type: 'city', icon: 'business' },
  { label: 'Nông thôn', type: 'countryside', icon: 'leaf' },
  { label: 'Di tích lịch sử', type: 'historical', icon: 'globe' },
];

const TripsList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const tripsList = [];
        const querySnapshot = await firestore().collection('places').get(); 
        querySnapshot.forEach(doc => {
          tripsList.push({ id: doc.id, ...doc.data() });
        });
        setList(tripsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  const filteredList = selectedFilter
    ? list.filter(item => item.type === selectedFilter)
    : list;

  return (
    <View style={styles.container}>
      {/* Bộ lọc */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filterContainer, { paddingTop: 10, paddingBottom: 10 }]}>
        {FILTER_OPTIONS.map(option => (
          <View key={option.type} style={styles.filterWrapper}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === option.type && styles.selectedFilter,
                selectedFilter === option.type && styles.selectedButton,
              ]}
              onPress={() => setSelectedFilter(selectedFilter === option.type ? null : option.type)}
            >
              <Icon name={option.icon} size={30} color={selectedFilter === option.type ? colors.white : colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.filterText, { color: selectedFilter === option.type ? colors.white : colors.primary }]}>
              {option.label}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Danh sách địa điểm */}
      <View style={styles.cardContainer}>
        {filteredList.map((item) => (
          <Card
            key={item.id}
            style={styles.card}
            onPress={() => {
              navigation.navigate('TripDetails', { trip: item });
            }}
          >
            <SharedElement id={`trip.${item.id}.image`} style={styles.media}>
              <CardMedia source={{ uri: item.imageUrl }} />
            </SharedElement>
            <CardContent style={styles.content}>
              <View style={styles.titleBox}>
                <Text style={styles.title}>{item.title}</Text> 
                <Text style={styles.location}>{item.location}</Text> 
              </View>
              <FavoriteButton />
            </CardContent>
          </Card>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    flexDirection: 'column',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: spacing.m,
    paddingHorizontal: spacing.l,
  },
  filterWrapper: {
    alignItems: 'center',
    marginHorizontal: spacing.s,
  },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 50,
    width: 60,
    height: 60,
    backgroundColor: 'transparent',
  },
  selectedFilter: {
    backgroundColor: colors.green,
  },
  selectedButton: {
    transform: [{ scale: 1.2 }],
  },
  filterText: {
    marginTop: 5,
    textAlign: 'center',
    marginBottom: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: spacing.l,
  },
  media: {
    flex: 1,
  },
  content: {
    paddingRight: spacing.m / 2,
  },
  titleBox: {
    flex: 1,
  },
  title: {
    marginVertical: 4,
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: colors.primary,
  },
  location: {
    fontSize: sizes.body,
    color: colors.lightGray,
  },
});

export default TripsList;
