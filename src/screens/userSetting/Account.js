import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Dialog from '../../extras/Dialog';
import {ref, remove} from 'firebase/database';
import {auth, database} from '../../../firebase/firebase';
import {EmailAuthProvider, reauthenticateWithCredential} from 'firebase/auth';
import {set} from 'date-fns';

const Account = () => {
  const navigation = useNavigation();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  console.log('Verification Code:', verificationCode);
  console.log('Confirm Password');

  const deleteAccount = async () => {
    const user = auth.currentUser;
    console.log('User:', user);

    if (user) {
      console.log("User's email:", user.email);

      try {
        const credential = EmailAuthProvider.credential(
          user.email,
          verificationCode,
        ); // Replace 'user-password' with the actual password
        await reauthenticateWithCredential(user, credential);
        // Delete user data from Realtime Database
        await remove(ref(database, `/users/${user.uid}`));
        // Delete user authentication account
        await user.delete();
        console.log('User account and data deleted successfully');

        setVerificationCode('');
        navigation.navigate('Login');
      } catch (error) {
        console.error('Error deleting account:', error);

        setVerificationCode('');
      }
    }
  };

  const showDialog = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const handleConfirm = async () => {
    // Handle the confirmation action here
    console.log('Confirmed');
    setPasswordModalVisible(true);
    await hideDialog();
  };

  const handlePassWordConfirm = async () => {
    setPasswordModalVisible(false);
    setDialogVisible(false);
    deleteAccount();
  };

  const options = [
    {
      icon: require('../../../public/assets/images/changePhoneNumber.png'),
      title: 'Change Number',
      press: () => navigation.navigate('ChangeNumber'),
    },
    {
      icon: require('../../../public/assets/images/twoStepVerification.png'),
      title: 'Two-step verification',
      press: () => navigation.navigate('TwoStepVerification'),
    },
    {
      icon: require('../../../public/assets/images/requestAccountInfo.png'),
      title: 'Request account info',
      press: () => navigation.navigate('RequestAccountInfo'),
    },
    {
      icon: require('../../../public/assets/images/addAccount.png'),
      title: 'Add account',
      press: () => navigation.navigate('AddAccount'),
    },
    {
      icon: require('../../../public/assets/images/deleteAccount.png'),
      title: 'Delete account',
      press: () => showDialog(),
    },
  ];

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        {options.map((option, index) => (
          <Pressable key={index} style={styles.press} onPress={option.press}>
            <View style={styles.insidePress}>
              <Image source={option.icon} style={{width: 30, height: 30}} />
              <Text style={styles.text}>{option.title}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <Dialog
        visible={dialogVisible}
        onClose={hideDialog}
        title="Are you sure you want to 
          delete your account?"
        onConfirm={handleConfirm}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={hideDialog}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Confirm Password</Text>
            <View style={{width: '90%', marginBottom: 40}}>
              <Text style={styles.modalText}>Enter your Password</Text>
              <TextInput
                placeholder="Enter here"
                defaultValue={verificationCode}
                style={styles.input}
                placeholderTextColor={'#9EA4AA'}
                onChangeText={setVerificationCode}
                secureTextEntry
              />
            </View>
            <View style={styles.buttonContainer}>
              <Pressable onPress={hideDialog} style={styles.btn}>
                <Text style={styles.btnText1}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handlePassWordConfirm}
                style={[styles.btn, {backgroundColor: '#D0E3FF'}]}>
                <Text style={[styles.btnText, {color: '#273567'}]}>
                  Confirm
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#185389',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 20,
    paddingTop: 20,
  },
  press: {
    borderBottomWidth: 1,
    marginHorizontal: 20,
    borderBottomColor: '#E8EBED',
  },
  insidePress: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    margin: 10,
  },
  text: {
    color: '#26282B',
    fontSize: 14,
    fontWeight: '600',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
  },
  modalText: {
    textAlign: 'flex-start',
    color: '#273567',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    gap: 10,
  },
  btn: {
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#185389',
    flex: 1,
    alignItems: 'center',
  },
  btnText: {
    color: '#273567',
    fontWeight: '600',
    fontSize: 16,
  },
  btnText1: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    height: 40,
    padding: 8,
    color: 'black',
    borderColor: '#C9CDD2',
  },
});
