import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import React from 'react';
import { colors, sizes } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

const locations = [
    {
        id: '1',
        title: 'TP. Hồ Chí Minh',
        image: 'https://tphcm.dangcongsan.vn/DATA/72/IMAGES/2023/11/tao-da-de-tphcm-phat-trien-thanh-do-thi-thong-minh1517188897.jpg',
    },
    {
        id: '2',
        title: 'Lâm Đồng',
        image: 'https://asiasky.com.vn/wp-content/uploads/2023/12/top-22-dia-diem-du-lich-lam-dong-dep-nhat-dinh-kh-1.jpeg',
    },
    {
        id: '3',
        title: 'Phú Yên',
        image: 'https://dulichyviet.com.vn/wp-content/uploads/2024/02/ban-do-du-lich-phu-yen-21.jpeg',
    },
    {
        id: '4',
        title: 'Quảng Nam',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKz5de4jDW59U5rvTHYXxqvb7sq0g4eOKSJg&s',
    },
];

const ViewPlacesByRegion = () => {
    const navigation = useNavigation(); // Sử dụng hook để lấy navigation

    const renderLocation = ({ item }) => (
        <TouchableOpacity
            style={styles.locationCard}
            onPress={() => navigation.navigate('RegionListScreen', { title: item.title })} 
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.locationtitle}>{item.title}</Text>
            <Text>Khám phá ngay</Text>
        </TouchableOpacity>
    );
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đề xuất khu vực dành cho bạn</Text>
            <FlatList
                data={locations}
                renderItem={renderLocation}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

export default ViewPlacesByRegion;

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        padding: 15,
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    locationCard: {
        marginRight: 10,
        width: 150,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: colors.light,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    locationtitle: {
        fontSize: sizes.body,
        fontWeight: 'bold',
        color: colors.black,
    },
});
