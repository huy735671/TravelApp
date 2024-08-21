import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {colors} from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {spacing} from '../../constants/theme';

const CodeEntryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập Code</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập mã code của bạn"
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            /* Xử lý gửi mã code */
          }}>
          <Text style={styles.buttonText}>Áp dụng</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.describeContainer}>
        <View style={styles.describeItem}>
          <Icons name="check-circle" size={20} color="#4CAF50" />
          <Text style={styles.describeText}>
            Mã chương trình khuyến mãi hoặc số điện thoại người giới thiệu cho
            bạn.
          </Text>
        </View>
        <View style={styles.describeItem}>
          <Icons name="check-circle" size={20} color="#4CAF50" />
          <Text style={styles.describeText}>
            Đối với người dùng mới, CTKM tham gia được tính bằng mã mà người
            dùng nhập cuối cùng trước khi liên kết ngân hàng.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    elevation: 25,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#4D8D6E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  describeContainer: {
    marginTop: 20,
    width: '100%',
  },
  describeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  describeText: {
    marginLeft: 10,
    fontSize: spacing.m - 2,
    color: colors.black,
  },
});

export default CodeEntryScreen;