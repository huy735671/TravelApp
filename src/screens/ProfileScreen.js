import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Platform,
  ScrollView,
  Modal,
  ToastAndroid,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import { colors } from '../constants/theme';

const ProfileScreen = () => {
  const route = useRoute();
  const {userInfo} = route.params;

  const [avatar, setAvatar] = useState(userInfo.avatarUrl);
  const [username, setUsername] = useState(userInfo.username || '');
  const [email, setEmail] = useState(userInfo.email || '');
  const [phone, setPhone] = useState(userInfo.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState(userInfo.bio || '');
  const [travelHobby, setTravelHobby] = useState(userInfo.travelHobby || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false); // Modal for gender

  useEffect(() => {
    // Load user data from Firestore when component mounts
    const loadUserData = async () => {
      const userDoc = await firestore().collection('users').doc(userInfo.email).get();
      const userData = userDoc.data();

      // Set dateOfBirth and gender from Firestore, if available
      if (userData) {
        setDateOfBirth(userData.dateOfBirth ? new Date(userData.dateOfBirth) : null);
        setGender(userData.gender || '');
      }
    };

    loadUserData();
  }, [userInfo.email]);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === 'ios');
    setDateOfBirth(currentDate);
  };

  const handleChooseAvatar = () => {
    launchImageLibrary({}, response => {
      if (response.didCancel) return;
      if (response.assets) {
        const uri = response.assets[0].uri;
        setAvatar(uri);
        const reference = storage().ref(`/avatars/${userInfo.email}.jpg`);
        reference.putFile(uri).then(() => {
          reference.getDownloadURL().then(url => {
            firestore()
              .collection('users')
              .doc(userInfo.email)
              .update({avatarUrl: url});
          });
        });
      }
    });
  };

  const handleSaveProfile = () => {
    firestore().collection('users').doc(userInfo.email).update({
      username,
      phone,
      dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null,
      gender,
      bio,
      travelHobby,
    }).then(() => {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Cập nhật thành công', ToastAndroid.SHORT);
      }
    });
  };

  const handleGenderSelect = selectedGender => {
    setGender(selectedGender);
    setShowGenderModal(false); // Close modal after selecting gender
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{uri: avatar}} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icons name="person" size={80} color="#999" />
          </View>
        )}
        <TouchableOpacity
          style={styles.cameraIcon}
          onPress={handleChooseAvatar}>
          <Icons name="camera-alt" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.bodyContainer}>
        <Text style={styles.headerText}>Thông tin cá nhân</Text>

        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Nhập họ và tên"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={email}
          editable={false}
        />

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Nhập số điện thoại"
        />

        <Text style={styles.label}>Ngày sinh</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            value={dateOfBirth ? dateOfBirth.toLocaleDateString('vi-VN') : 'dd/mm/yyyy'}
            editable={false}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <Text style={styles.label}>Giới tính</Text>
        <TouchableOpacity
          style={styles.genderSelector}
          onPress={() => setShowGenderModal(true)}>
          <Text style={styles.genderText}>
            {gender === '' ? 'Chọn giới tính' : gender}
          </Text>
        </TouchableOpacity>

        {/* Gender Modal */}
        <Modal
          transparent={true}
          visible={showGenderModal}
          animationType="slide"
          onRequestClose={() => setShowGenderModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.modalCloseIcon}
                onPress={() => setShowGenderModal(false)}>
                <Icons name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Chọn giới tính</Text>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleGenderSelect('Nam')}>
                <Text style={styles.modalItemText}>Nam</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleGenderSelect('Nữ')}>
                <Text style={styles.modalItemText}>Nữ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleGenderSelect('Khác')}>
                <Text style={styles.modalItemText}>Khác</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.additionalInfoContainer}>
          <Text style={styles.additionalInfoTitle}>Thông tin bổ sung</Text>

          <Text style={styles.label}>Tiểu sử</Text>
          <TextInput
            style={[styles.input, styles.largeInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Giới thiệu ngắn về bản thân"
            multiline={true}
          />

          <Text style={styles.label}>Sở thích du lịch</Text>
          <TextInput
            style={[styles.input, styles.largeInput]}
            value={travelHobby}
            onChangeText={setTravelHobby}
            placeholder="Ví dụ: Khám phá ẩm thực, leo núi, tham quan di tích lịch sử"
            multiline={true}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    right: 125,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
  },
  bodyContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  disabledInput: {
    backgroundColor: '#eaeaea',
  },
  largeInput: {
    height: 100, 
    textAlignVertical: 'top', 
  },
  genderSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  genderText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 10,
  },
  modalItemText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 10,
    padding: 10,
  },
  modalCloseButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalCloseIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  additionalInfoContainer: {
    marginTop: 20,
  },
  additionalInfoTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
