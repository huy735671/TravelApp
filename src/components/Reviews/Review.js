import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { colors, sizes, spacing } from '../../constants/theme';
import Rating from '../shared/Rating/Rating';
import Divider from '../shared/Divider';

const Review = ({ review }) => {
  // URL ảnh dự phòng
  const defaultAvatar = 'https://media.istockphoto.com/id/1288129985/vi/vec-to/thi%E1%BA%BFu-h%C3%ACnh-%E1%BA%A3nh-c%E1%BB%A7a-tr%C3%ACnh-gi%E1%BB%AF-ch%E1%BB%97-cho-m%E1%BB%99t-ng%C6%B0%E1%BB%9Di.jpg?s=612x612&w=0&k=20&c=2mBRPdxj9u08XRt8L9iu-iLgDEV-ts3uqkkG2ReteTw=';

  return (
    <>
      <Divider enabledSpacing={false} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.avatar}
            source={{ uri: review.author.avatar || defaultAvatar }} 
          />
          <View style={styles.userBox}>
            <Text style={styles.user}>{review.author.username}</Text>
            <Text style={styles.date}>{review.date}</Text>
          </View>
          <Rating rating={review.rating} showLabelTop />
        </View>
        <Text style={styles.text}>{review.text}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.l,
    paddingHorizontal:10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  avatar: {
    height: 30,
    width: 30,
    resizeMode: 'cover',
    borderRadius: sizes.radius,
    marginRight: spacing.s,
  },
  userBox: {
    flex: 1,
    marginRight: spacing.s,
  },
  user: {
    color: colors.primary,
    fontSize: sizes.body,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  date: {
    fontSize: sizes.caption,
    color: colors.lightGray,
  },
  text: {
    color: colors.gray,
  },
});

export default Review;
