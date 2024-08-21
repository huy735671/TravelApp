import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { OFFERSBANNER } from '../../data';

const BannerCode = ({ page, setPage, setShowCodeEntry }) => {
  const bannerImage = OFFERSBANNER[0].image;

  return (
    <View style={{ flex: 1, marginBottom: 20 }}>
      <View style={{ width: '100%', height: 200 }}>
        <Image source={bannerImage} style={styles.bannerImage} />
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, page === 'CODE_ENTRY' && styles.activeTab]}
          onPress={() => {
            setPage('CODE_ENTRY');
            setShowCodeEntry(true); // Show CodeEntryScreen
          }}
          disabled={page === 'CODE_ENTRY'}
        >
          <Text style={styles.tabText}>Nhập mã</Text>
          {page === 'CODE_ENTRY' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, page === 'CODE_SEARCH' && styles.activeTab]}
          onPress={() => {
            setPage('CODE_SEARCH');
            setShowCodeEntry(false); // Hide CodeEntryScreen
          }}
          disabled={page === 'CODE_SEARCH'}
        >
          <Text style={styles.tabText}>Quà của tôi</Text>
          {page === 'CODE_SEARCH' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    

  },
  tabContainer: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: 'white',
    
  },
  tabButton: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  activeTab: {
    backgroundColor: '#f0f0f0',
    
  },
  tabText: {
    fontSize: 20,
    color: '#4D8D6E',
  },
  tabUnderline: {
    height: 3,
    width: '100%',
    backgroundColor: '#4D8D6E',
    position: 'absolute',
    bottom: 0,
    
  },
});

export default BannerCode;
