import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { colors } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

const ExploreScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Phần Khám Phá Việt Nam */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.exploreContainer}
          onPress={() => navigation.navigate('RegionFilter')}>
          <ImageBackground
            source={{
              uri: 'https://ddk.1cdn.vn/thumbs/540x360/2016/10/02/image.daidoanket.vn-images-upload-2020-5-22-_truyen-hinh-duc-lam-chuong-trinh-kham-pha-viet-nam-10-01102016224300.jpg',
            }} // Thay thế bằng link hình ảnh của bạn
            style={styles.exploreImage}
            resizeMode="cover">
            <View style={styles.overlay}>
              <Text style={styles.exploreText}>Khám Phá Việt Nam</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity style={styles.offerContainer}>
          <View style={styles.offerContent}>
            <Text style={styles.offerTitle}>Ưu đãi hôm nay</Text>
            <Text style={styles.offerDescription}>
              Tìm kiếm nhiều ưu đãi cho chuyến đi của bạn
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.light,
    alignItems: 'flex-start',
  },
  exploreContainer: {
    marginRight: 10, // Thêm khoảng cách giữa hình ảnh và phần ưu đãi
    borderRadius: 10,
    overflow: 'hidden',
  },
  exploreImage: {
    width: 250, // Chiều rộng của hình ảnh
    height: 150, // Chiều cao của hình ảnh
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  exploreText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  offerContainer: {
    marginLeft: 10, // Thêm khoảng cách giữa hình ảnh và phần ưu đãi
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.secondary, // Thay đổi màu nền cho phần ưu đãi
    width: 250, // Đặt chiều rộng cho phần ưu đãi
    height: 150, // Đặt chiều cao cho phần ưu đãi
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1,
    borderColor:'#ddd',
  },
  offerImage: {
    width: 250, // Chiều rộng của phần ưu đãi
    height: 150, // Chiều cao của phần ưu đãi
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  offerDescription: {
    color: colors.primary,
    fontSize: 14,
    textAlign: 'center',
  },
});
