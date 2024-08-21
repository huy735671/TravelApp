import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import OfferItem from './OfferItem'; 

const OfferList = ({ data }) => {
  const renderItem = ({ item }) => <OfferItem offer={item} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.offerList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  offerList: {
    padding: 10,
    marginTop: 20,
  },
});

export default OfferList;
