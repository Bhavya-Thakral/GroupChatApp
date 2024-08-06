import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import MainScreen from '../../extras/MainScreen';
import {OtpInput} from 'react-native-otp-entry';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';

import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';

const Otp = ({route, navigation}) => {
  const {confirm} = route.params || {};
  console.log(confirm, 'confirm');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  async function confirmCode() {
    setLoading(true);
    try {
      console.log('code', otp);
      const userCredential = await confirm.confirm(otp);
      console.log('Success');
      console.log(userCredential);
      const {additionalUserInfo} = userCredential;
      if (additionalUserInfo.isNewUser) {
        console.log('User signed in for the first time');
        navigation.navigate('Register', {userCredential});
      } else {
        console.log('User has signed in before');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'MyTabs'}],
          }),
          {userCredential},
        );
      }
      await storeUserInfo({
        userID: userCredential.user.uid,
        userName: userCredential.user.displayName,
      });
      await onUserLogin(
        userCredential.user.uid,
        userCredential.user.displayName,
      );
    } catch (error) {
      console.log('Invalid code.', error.message);
    } finally {
      setLoading(false);
    }
  }

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
      head={'OTP Verification'}
      subHead={'We have sent a verification code to your mobile number.'}
      onPress={confirmCode}
      loading={loading}>
      <View style={{width: '80%'}}>
        <OtpInput
          numberOfDigits={6}
          onTextChange={setOtp}
          autoFocus={true}
          textInputProps={{
            accessibilityLabel: 'One-Time Password',
          }}
          theme={{
            pinCodeTextStyle: {color: '#273567'},
            pinCodeContainerStyle: {
              borderWidth: 0,
              borderBottomColor: '#9EA4AA',
              borderBottomWidth: 1,
            },
            filledPinCodeContainerStyle: {borderBottomColor: '#273567'},
          }}
          focusColor={'#273567'}
        />
      </View>
    </MainScreen>
  );
};

export default Otp;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    resizeMode: 'cover',
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
