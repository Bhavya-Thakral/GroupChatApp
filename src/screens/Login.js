import {Pressable, StyleSheet, TextInput, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {auth} from '../../firebase/firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useChat} from '../Context/Context';
import messaging from '@react-native-firebase/messaging';

import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZIM from 'zego-zim-react-native';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setCurrentUser} = useChat();
  const [userToken, setUserToken] = useState(null);

  function handleRegister() {
    return navigation.navigate('Register');
  }

  useEffect(() => {
    async function getToken() {
      const token = await messaging().getToken();
      setUserToken(token);
    }
    console.log('chahiye user token');
    console.log('User token:', userToken);
    console.log('mila token');
    getToken();
    return messaging().onTokenRefresh(token => {
      console.log('New FCM Token:', token);
    });
  }, []);

  function handleLogin() {
    console.log('auth', JSON.stringify(auth, 2, 0));
    signInWithEmailAndPassword(auth, email, password)
      .then(async userCredential => {
        const user = userCredential.user;
        // console.log('user', user);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('userToken', userToken);
        await setCurrentUser(user);
        onUserLogin(user.uid, user.displayName).then(() => {
          const id = user.uid;
          const name = user.displayName;
          storeUserInfo({id, name});
          navigation.replace('MyTabs');
        });
      })
      .catch(error => {
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
      });
  }

  const storeUserInfo = async info => {
    await AsyncStorage.setItem('userID', info.userID);
    await AsyncStorage.setItem('userName', info.userName);
    console.log('setting user id', info.userID);
  };

  const onUserLogin = async (userID, userName) => {
    return ZegoUIKitPrebuiltCallService.init(
      97492,
      'e930226544e43d2a3b39fc6c0721dfcf7f1f26c6b5f7a258a223f57ba5220e67',
      userID,
      userName,
      [ZIM],
      //   {
      //     ringtoneConfig: {
      //       incomingCallFileName: 'zego_incoming.mp3',
      //       outgoingCallFileName: 'zego_outgoing.mp3',
      //     },
      //   },
    );
  };

  function handlePhoneSignIn() {
    return navigation.navigate('PhoneSignIn');
  }

  return (
    <View style={styles.main}>
      {/* <Text style={styles.head}>Login</Text> */}
      <View style={{alignSelf: 'flex-start', width: '100%'}}>
        <Text style={styles.subHead}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          keyboardType="email-address"
          value={email}
          placeholder="Enter Email"
          placeholderTextColor={'black'}
        />
      </View>
      <View style={{alignSelf: 'flex-start', width: '100%'}}>
        <Text style={styles.subHead}>Password</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor={'black'}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={{alignSelf: 'flex-start', width: '100%', gap: 10}}>
        <Pressable onPress={handleRegister}>
          <Text style={styles.btn1}>Want to Register?</Text>
        </Pressable>
        <Pressable onPress={handlePhoneSignIn}>
          <Text style={styles.btn1}>Sign in through Mobile Number</Text>
        </Pressable>
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={handleLogin}>
          <View style={styles.btn}>
            <Text style={styles.btnTxt}>Login</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  head: {
    color: 'black',
    fontSize: 16,
    fontWeight: '800',
  },
  subHead: {
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 7,
    color: 'black',
  },
  btn1: {
    fontSize: 12,
    textDecorationLine: 'underline',
    color: 'blue',
  },
  btn: {
    backgroundColor: 'blue',
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTxt: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});
