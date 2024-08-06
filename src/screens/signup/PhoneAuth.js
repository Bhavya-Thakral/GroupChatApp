import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {signInWithPhoneNumber} from 'firebase/auth';

const PhoneAuth = ({setPhone}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [OTP, setOTP] = useState('');

  async function sendVerificationCode() {
    const newPhone = '+91 ' + phoneNumber;
    const confirmation = await auth().signInWithPhoneNumber(newPhone);
    // console.log('confirmation', confirmation);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(OTP);
      console.log('Phone number verified and user signed in!');
      setPhone(phoneNumber);
    } catch (error) {
      console.log('Invalid code.', error.message);
    }
  }
  return (
    <>
      <View style={{alignSelf: 'flex-start', width: '100%'}}>
        <Text style={styles.subHead}>Phone No.</Text>
        <View style={{flexDirection: 'row', width: '100%'}}>
          <View style={{flex: 7}}>
            <TextInput
              style={styles.input}
              onChangeText={setPhoneNumber}
              keyboardType="number-pad"
              maxLength={10}
              value={phoneNumber}
              placeholder="Enter Phone No."
              placeholderTextColor={'black'}
            />
          </View>
          <Pressable
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 5,
            }}
            onPress={sendVerificationCode.bind(this, phoneNumber)}>
            <Text style={{fontSize: 16, color: 'blue'}}>Send OTP</Text>
          </Pressable>
        </View>
      </View>

      {confirm && (
        <View style={{alignSelf: 'flex-start', width: '100%'}}>
          <Text style={styles.subHead}>OTP</Text>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <View style={{flex: 7}}>
              <TextInput
                style={styles.input}
                onChangeText={setOTP}
                keyboardType="number-pad"
                maxLength={6}
                value={OTP}
                placeholder="Enter OTP"
                placeholderTextColor={'black'}
              />
            </View>
            <Pressable
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 5,
              }}
              onPress={confirmCode}>
              <Text style={{fontSize: 16, color: 'blue'}}>Verify OTP</Text>
            </Pressable>
          </View>
        </View>
      )}
    </>
  );
};

export default PhoneAuth;

const styles = StyleSheet.create({
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
});
