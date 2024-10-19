import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable';
import Icon from '../shared/Icon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Card from '../shared/Card/card';
import CardMedia from '../shared/Card/CardMedia';
import CardContent from '../shared/Card/CardContent';
import {spacing, sizes, colors} from '../../constants/theme';

const RegionListScreen = ({route}) => {
  const {title} = route.params; // Nhận title từ route params
  const [places, setPlaces] = useState([]);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPlaces = async () => {
      const snapshot = await firestore()
        .collection('places')
        .where('location', '==', title)
        .get();

      const placesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPlaces(placesData);
    };

    fetchPlaces();
  }, [title]);

  const renderPlace = ({item, index}) => {
    const even = index % 2 === 0; // Kiểm tra nếu index là số chẵn

    return (
      <Animatable.View
        animation="fadeIn"
        delay={index * 100}
        style={{
          paddingTop: index === 0 ? spacing.l : 0, // Padding cho thẻ đầu tiên
          paddingLeft: even ? spacing.l / 2 : 0, // Thêm padding bên trái cho thẻ chẵn
          paddingRight: even ? 0 : spacing.l / 2, // Thêm padding bên phải cho thẻ lẻ
          paddingBottom: spacing.l,
          flex: 1, // Để cho các thẻ co giãn
          paddingLeft:10,
        }}>
        <Card
          onPress={() => navigation.navigate('TripDetails', { trip: item })}
          style={styles.card}>
          <CardMedia source={{uri: item.imageUrl}} />
          <CardContent>
          <View>
            <Text style={styles.title}>{item.title || 'Tiêu đề không có'}</Text>
            <Text>{item.location}</Text>
           <Text>{item.starRating}</Text> 
           
            </View>
          </CardContent>
        </Card>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <Animatable.View
        style={[styles.backButton, {marginTop: insets.top}]}
        animation="fadeIn"
        delay={500}
        duration={400}
        easing="ease-in-out">
        <Icon
          icon="Back"
          style={styles.backIcon}
          size={40}
          onPress={navigation.goBack}
        />
      </Animatable.View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Các địa điểm du lịch tại {title}</Text>
      </View>

      <FlatList
        data={places}
        renderItem={renderPlace}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

export default RegionListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 1,
    backgroundColor: colors.white,
    width: '100%',
    
  },
  title: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 4,
  },
  location: {
    fontSize: sizes.body,
    color: colors.lightGray,
    
  },
  columnWrapper: {
    justifyContent: 'space-between', // Căn giữa các cột
  },
});
