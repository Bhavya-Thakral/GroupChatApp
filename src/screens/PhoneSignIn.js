import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {signInWithPhoneNumber} from 'firebase/auth';

const PhoneSignIn = ({navigate}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');

  async function signInWithPhoneNumber(phoneNumber) {
    const newPhoneNumber = '+91 ' + phoneNumber;
    // console.log('newPhoneNumber', newPhoneNumber);

    const confirmation = await auth().signInWithPhoneNumber(newPhoneNumber);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      // console.log('code', code);
      await confirm.confirm(code);
      // console.log('Success');
      navigate.navigate('Register');
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  return (
    <View style={styles.main}>
      <View style={{alignSelf: 'flex-start', width: '100%'}}>
        <Text style={styles.subHead}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPhoneNumber}
          value={phoneNumber}
          placeholder="Enter phone number"
          placeholderTextColor={'black'}
          keyboardType="phone-pad"
        />
      </View>
      {confirm && (
        <View style={{alignSelf: 'flex-start', width: '100%'}}>
          <Text style={styles.subHead}>OTP</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={'black'}
            placeholder="Enter OTP"
            value={code}
            onChangeText={setCode}
            // secureTextEntry
          />
        </View>
      )}
      <View style={{alignSelf: 'flex-start', width: '100%', gap: 10}}>
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={
            confirm !== null
              ? confirmCode
              : signInWithPhoneNumber.bind(this, phoneNumber)
          }>
          <View style={styles.btn}>
            <Text style={styles.btnTxt}>{confirm ? 'Send OTP' : 'Login'}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default PhoneSignIn;

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
