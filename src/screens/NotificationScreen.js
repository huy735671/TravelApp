import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const NotificationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông báo</Text>
      {/* Thêm danh sách thông báo tại đây */}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});
