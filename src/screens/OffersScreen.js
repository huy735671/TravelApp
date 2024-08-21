import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {OFFERS} from '../data';
import BannerCode from '../components/New/BannerCode';
import MainHeader from '../components/shared/MainHeader';
import CodeEntryScreen from '../components/New/CodeEntryScreen';
import OfferList from '../components/New/OfferList';

const OffersScreen = () => {
  const [page, setPage] = useState('CODE_SEARCH');
  const [showCodeEntry, setShowCodeEntry] = useState(false);

  return (
    <View style={styles.container}>
      <MainHeader />
      <View style={{width: '100%', height: '30%'}}>
        <BannerCode
          page={page}
          setPage={setPage}
          setShowCodeEntry={setShowCodeEntry}
        />
      </View>

      {showCodeEntry ? (
        <CodeEntryScreen onBack={() => setShowCodeEntry(false)} />
      ) : (
        page === 'CODE_SEARCH' && <OfferList data={OFFERS} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
});

export default OffersScreen;
