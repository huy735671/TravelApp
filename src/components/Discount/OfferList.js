import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import OfferItem from './OfferItem'; 

const OfferList = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOffers = async () => {
      try {
        const user = auth().currentUser;

        if (!user) {
          alert('Vui lòng đăng nhập để xem ưu đãi.');
          setLoading(false);
          return;
        }

        // Bước 2: Lấy mã giảm giá của người dùng
        const userDiscountsSnapshot = await firestore()
          .collection('userDiscounts')
          .where('userId', '==', user.email)
          .get();

        if (userDiscountsSnapshot.empty) {
          setOffers([]); // Không có mã giảm giá
          setLoading(false);
          return;
        }

        const discountIds = userDiscountsSnapshot.docs.map(doc => doc.data().discountId);

        // Bước 3: Lấy thông tin chi tiết của các mã giảm giá
        const discountPromises = discountIds.map(id =>
          firestore().collection('discounts').doc(id).get()
        );

        const discountSnapshots = await Promise.all(discountPromises);
        const offersData = discountSnapshots.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Bước 4: Kiểm tra và xóa mã giảm giá không tồn tại
        const userDiscountsToDelete = [];

        userDiscountsSnapshot.docs.forEach((doc, index) => {
          const discountId = doc.data().discountId;
          const discountDoc = discountSnapshots[index];

          if (!discountDoc.exists) {
            // Nếu mã giảm giá không tồn tại, lưu lại id của userDiscounts để xóa
            userDiscountsToDelete.push(doc.id); // Sử dụng doc.id để xóa
          }
        });

        // Bước 5: Xóa các mã giảm giá không tồn tại
        if (userDiscountsToDelete.length > 0) {
          const batch = firestore().batch();
          userDiscountsToDelete.forEach(discountId => {
            const docRef = firestore().collection('userDiscounts').doc(discountId);
            batch.delete(docRef);
          });
          
          console.log("Deleting user discounts: ", userDiscountsToDelete);
          
          await batch.commit();
          
          console.log("User discounts deleted successfully.");
        }

        setOffers(offersData); // Cập nhật danh sách mã giảm giá
      } catch (error) {
        console.error('Error fetching user offers: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOffers();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách ưu đãi của bạn</Text>
      {offers.length > 0 ? (
        <FlatList
          data={offers}
          renderItem={({ item }) => <OfferItem offer={item} />}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.noOffers}>Bạn chưa có ưu đãi nào.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  noOffers: {
    fontSize: 16,
    color: '#666',
  },
});

export default OfferList;
