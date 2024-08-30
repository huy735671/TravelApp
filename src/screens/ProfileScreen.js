import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import {shadow, sizes, spacing} from '../constants/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from '../components/shared/Icon';
import {useNavigation} from '@react-navigation/native';
import {colors} from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Animatable.View
        style={[styles.backButton, {marginTop: insets.top}]}
        animation="fadeIn"
        delay={500}
        duration={400}
        easing="ease-in-out">
        <Icon icon="Back" style={styles.backIcon} onPress={navigation.goBack} />
      </Animatable.View>

      <Animatable.View
        style={styles.bodyContainer}
        animation="fadeIn"
        delay={500}
        duration={400}
        easing="ease-in-out">
        <Text style={styles.headertext}>Thông tin cá nhân</Text>
        <Text>
          TravelNest sử dụng thông tin này để xác minh danh tính của bạn và bảo
          vệ cộng đồng của chúng tôi. Bạn là người quyết định những thông tin cá
          nhân nào sẽ hiển thị với người khác
        </Text>
        <View style={styles.informationContainer}>
          <View style={styles.informationBox}>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <View>
                <Text style={styles.informationHeaderText}>
                  Thông tin liên hệ
                </Text>
                <Text style={styles.informationText}>huy735671@gmail.com</Text>
                <Text style={styles.informationText}>+0849999999</Text>
              </View>

              <Icons name="chevron-right" size={40} style={styles.enterIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    left: spacing.l,
    zIndex: 1,
  },
  backIcon: {
    backgroundColor: colors.white,
    padding: 4,
    borderRadius: sizes.radius,
    ...shadow.light,
  },
  bodyContainer: {
    marginTop: 50,
    justifyContent: 'center',
    padding: 20,
  },
  headertext: {
    fontWeight: 'bold',
    fontSize: sizes.h2 + 5,
    color: colors.black,
  },
  informationContainer: {
    borderRadius: 20,
    elevation: 5,
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  informationBox: {},
  informationHeaderText: {
    fontSize: sizes.h3,
    color: colors.black,
  },
  enterIcon: {
    position: 'absolute',
    right: 0,
  },
});
