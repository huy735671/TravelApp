import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

const OfferItem = ({offer}) => {
  return (
    <View style={styles.offerContainer}>
      <Image source={offer.image} style={styles.offerImage} />
      <View style={styles.offerDetails}>
        <Text style={styles.offerTitle}>{offer.title}</Text>
        <Text style={styles.offerDescription}>{offer.description}</Text>
        <Text style={styles.offerExpiryDate}>
          Hạn sử dụng: {offer.expiryDate}
        </Text>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Dùng ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  offerContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation:10,
  },
  offerImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  offerDetails: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  offerDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  offerExpiryDate: {
    fontSize: 12,
    color: '#999',
  },
  detailsButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  detailsButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default OfferItem;
