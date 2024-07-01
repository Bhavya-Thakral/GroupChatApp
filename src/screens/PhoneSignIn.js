import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import { auth } from '../../firebase/firebase';

const PhoneSignIn = () => {

    const [confirm, setConfirm] = useState(null);

    const [code, setCode] = useState('');

    async function signInWithPhoneNumber(phoneNumber) {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
      }

      async function confirmCode() {
        try {
          await confirm.confirm(code);
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
          onChangeText={setEmail}
          value={email}
          placeholder="Enter Email"
          placeholderTextColor={'black'}
        />
      </View>
      {confirm && (
      <View style={{alignSelf: 'flex-start', width: '100%'}}>
        <Text style={styles.subHead}>OTP</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor={'black'}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      )}
      <View style={{alignSelf: 'flex-start', width: '100%', gap: 10}}>
        <Pressable onPress={handleRegister}>
          <Text style={styles.btn1}>Want to Register?</Text>
        </Pressable>
        <Pressable onPress={handlePhoneSignIn}>
          <Text style={styles.btn1}>Sign in through Email</Text>
        </Pressable>
        <Pressable
          style={({pressed}) => pressed && styles.pressed}
          onPress={signInWithPhoneNumber}>
          <View style={styles.btn}>
            <Text style={styles.btnTxt}>{confirm ? 'Send OTP' :'Login'}</Text>
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
