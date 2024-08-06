import {StyleSheet, TextInput, Text, View, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
// import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useChat} from '../../Context/Context';
import messaging from '@react-native-firebase/messaging';
// import {auth} from '../../../firebase/firebase';
import auth from '@react-native-firebase/auth';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import MainScreen from '../../extras/MainScreen';

const Login = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    async function getToken() {
      const token = await messaging().getToken();
      setUserToken(token);
      console.log('User token:', token);
    }

    getToken();
    return messaging().onTokenRefresh(token => {
      console.log('New FCM Token:', token);
      setUserToken(token);
    });
  }, []);

  async function sendVerificationCode() {
    setLoading(true);
    try {
      const newPhoneNumber = '+91 ' + phone;
      const confirmation = await auth().signInWithPhoneNumber(newPhoneNumber);
      setConfirm(confirmation);
      navigation.navigate('Otp', {confirm: confirmation, userToken: userToken});
    } catch (e) {
      Alert.alert('Please try again later', e.message);
      console.error('Failed to sign in with phone number', e);
    } finally {
      setLoading(false);
    }
  }

  // async function sendVerificationCode() {
  //   const newPhone = '+91 ' + phone;
  //   console.log('newPhone', newPhone);
  //   const confirmation = await auth().signInWithPhoneNumber(newPhone);
  //   console.log('confirmation', confirmation);
  //   setConfirm(confirmation);
  // }

  const storeUserInfo = async info => {
    try {
      await AsyncStorage.setItem('userID', info.id);
      await AsyncStorage.setItem('userName', info.name);
      console.log('User info stored:', info.id, info.name);
    } catch (e) {
      console.error('Failed to store user info', e);
    }
  };

  const onUserLogin = async (userID, userName) => {
    console.log('userId', userID);
    console.log('userName', userName);
    return ZegoUIKitPrebuiltCallService.init(
      97492,
      'e930226544e43d2a3b39fc6c0721dfcf7f1f26c6b5f7a258a223f57ba5220e67',
      userID,
      userName,
      [ZIM, ZPNs],
      {
        ringtoneConfig: {
          incomingCallFileName: 'zego_incoming.mp3',
          outgoingCallFileName: 'zego_outgoing.mp3',
        },
        androidNotificationConfig: {
          channelID: 'ZegoUIKit',
          channelName: 'ZegoUIKit',
        },
        notifyWhenAppRunningInBackgroundOrQuit: true,
        requireConfig: data => {
          return {
            layout: {
              mode: ZegoLayoutMode.pictureInPicture,
              config: {
                smallViewBackgroundColor: '#333437',
                largeViewBackgroundColor: '#4A4B4D',
                smallViewBackgroundImage: require('../../../public/assets/images/callBg.png'),
                largeViewBackgroundImage: require('../../../public/assets/images/callBg.png'),
              },
            },
          };
        },
      },
    );
  };

  return (
    <MainScreen
      head={'Welcome Back to Chat App'}
      subHead={'Sign in your account'}
      onPress={sendVerificationCode.bind(this, phone)}
      loading={loading}>
      <View style={styles.content}>
        <Text style={styles.contentHead}>Mobile Number</Text>
        <TextInput
          placeholder="Enter your mobile number"
          style={styles.input}
          placeholderTextColor={'#C9CDD2'}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={10}
        />
        {/* <Text style={styles.contentHead}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          style={styles.input}
          placeholderTextColor={'#C9CDD2'}
          onChangeText={setPassword}
        /> */}
      </View>
    </MainScreen>
  );
};

export default Login;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  head: {
    color: '#273567',
    fontSize: 20,
    fontWeight: '700',
  },
  subHead: {
    color: '#9EA4AA',
    fontSize: 12,
    fontWeight: '400',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 8,
    color: 'black',
    height: 40,
    borderColor: '#C9CDD2',
  },

  content: {
    width: '90%',
    gap: 4,
  },
  contentHead: {
    color: '#273567',
    fontSize: 14,
    fontWeight: '600',
  },
});
