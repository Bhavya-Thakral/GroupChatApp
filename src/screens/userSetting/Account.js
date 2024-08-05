import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Dialog from '../../extras/Dialog';
import {ref, remove} from 'firebase/database';
import {auth, database} from '../../../firebase/firebase';
import {EmailAuthProvider, reauthenticateWithCredential} from 'firebase/auth';

const Account = () => {
  const navigation = useNavigation();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const deleteAccount = async () => {
    const user = auth.currentUser;
    console.log('User:', user);

    if (user) {
      try {
        const code = prompt('Enter the verification code sent to your phone:');
        setVerificationCode(code);

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
      } catch (error) {
        console.error('Error deleting account:', error);
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
    await deleteAccount();
    await hideDialog();
  };

  async function deleteHandler() {
    showDialog();
  }

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
        // message=" simply dummy text of the printing and etting industry. Lorem Ipsum"
        onConfirm={handleConfirm}
      />
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
});
