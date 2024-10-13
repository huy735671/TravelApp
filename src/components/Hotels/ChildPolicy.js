import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, sizes } from '../../constants/theme';

const ChildPolicy = () => {
  return (
    <View style={{flex:1}}>
    <View style={styles.container}>
      <Text style={styles.title}>Chính sách cho trẻ em</Text>
      <Text style={styles.policyText}>
        Trẻ em 1 tuổi trở lên được chào đón tại khách sạn này.{'\n'}Trẻ em được lưu trú miễn phí. Vui lòng nhập đúng số lượng trẻ để xem giá chính xác hơn.
      </Text>

      <Text style={styles.subTitle}>Chính sách về giường phụ</Text>
      <Text style={styles.policyText}>
        Không thể bổ sung giường phụ cho loại phòng này.
      </Text>
    </View>

    <View style={styles.container}>
      <Text style={styles.title}>Chính sách cơ sở lưu trú</Text>
      <Text style={styles.policyText}>
      Nếu không nhận phòng, bạn sẽ nhận chịu 1 khoảng phạt tương đương với phí hủy phòng </Text>
      <Text style={styles.policyText}>
      Tất cả thời gian đều được tính theo giờ địa phương của khách sạn </Text>

      <Text style={styles.subTitle}>Xác nhận ngay</Text>
      <Text style={styles.policyText}>
        Yêu cầu dặt phòng này sẽ được xác nhận ngay lập tức.
      </Text>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontWeight: 'bold',
    fontSize: sizes.body,
    marginBottom: 5,
    color: colors.primary,
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: sizes.body - 1,
    marginTop: 10,
    color: colors.secondary,
  },
  policyText: {
    fontSize: sizes.body - 2,
    marginTop: 5,
    color: colors.text,
  },
  
});

export default ChildPolicy;
