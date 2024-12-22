import React from 'react';
import {StyleSheet, Text, View, FlatList, SafeAreaView} from 'react-native';

const NotificationScreen = () => {
  // Dữ liệu thông báo giả lập
  const notifications = [
    {id: '1', message: 'Bạn có một thông báo mới từ phòng kỹ thuật.'},
    {id: '2', message: 'Hệ thống sẽ bảo trì vào ngày mai.'},
    {id: '3', message: 'Cập nhật phần mềm mới đã có sẵn.'},
  ];

  return (
    <View style={styles.container}>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.notificationItem}>
            <Text style={styles.notificationText}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },

  notificationItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
});
