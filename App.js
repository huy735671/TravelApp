import React from 'react';
import MainNavigator from './src/navigation/MainNavigator';
import { SafeAreaView, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    
    <SafeAreaView style={styles.container}>
      <MainNavigator />
      <Toast ref={Toast.setRef} />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
