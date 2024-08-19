import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
} from 'react-native';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileService from '../components/Profile/ProfileService';



export default function UserScreen() {
  return (
    <ScrollView>
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
        <View style={styles.container}>
          <ProfileHeader />
          <ProfileService />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  serviceContainer: {},
  footerContainer: {
    paddingLeft: 10,
    height: 50,
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
  },
  footerText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
    marginLeft: 20,
  },
  InputIcon: {
    marginLeft: 12,
    marginRight: 5,
  },
});
