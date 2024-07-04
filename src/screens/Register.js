
import { Pressable, StyleSheet,TextInput, Text, View, Alert} from 'react-native';
import React, { useState } from 'react';
import { CommonActions } from '@react-navigation/native';

import {auth, database} from '../../firebase/firebase';
import { createUserWithEmailAndPassword ,updateProfile } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, set, update } from 'firebase/database';

const Register = ({navigation}) => {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState("");
  const [displayName, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');


    const handleRegister = () => {
      createUserWithEmailAndPassword(auth,email,password,displayName,phoneNumber)
        .then(async (userCredential) => {
          const user = userCredential.user;
          await updateProfile(user, {
          displayName: displayName,
          phoneNumber: phoneNumber,
          });
          await AsyncStorage.setItem('user', JSON.stringify(user));
          await set(ref(database, `users/${user.uid}`), {
            email: user.email,
            name: displayName,
            phnNo: phoneNumber,
          });    
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'MyTabs' }],
            })
          );
        })
        .catch((error) => {
          const errorMessage = error.message;
          Alert.alert('Error', errorMessage);
        });
  }

  return (
    <View style={styles.main}>
      <View style={{alignSelf: 'flex-start', width: '100%'}}>
        <Text style={styles.subHead}>Name</Text>
        <TextInput style={styles.input} onChangeText={setName} value={displayName} placeholder='Enter Name' placeholderTextColor={"black"} />
      </View>
      <View style={{alignSelf: 'flex-start', width: '100%'}}>
        <Text style={styles.subHead}>Phone No.</Text>
        <TextInput style={styles.input} onChangeText={setPhoneNumber} keyboardType='number-pad' maxLength={10} value={phoneNumber} placeholder='Enter Phone No.' placeholderTextColor={"black"} />
      </View>
      <View style={{alignSelf: 'flex-start', width: '100%'}}>
        <Text style={styles.subHead}>Email</Text>
        <TextInput style={styles.input} onChangeText={setEmail} keyboardType='email-address' value={email} placeholder='Enter Email' placeholderTextColor={"black"} />
      </View>
      <View style={{alignSelf: 'flex-start', width: '100%'}}>
        <Text style={styles.subHead}>Password</Text>
        <TextInput style={styles.input} placeholderTextColor={"black"} placeholder='Enter password' value={password} onChangeText={setPassword} secureTextEntry />
      </View>
      <View style={{alignSelf: 'flex-start', width: '100%', gap: 10}}>
        <Pressable onPress={handleRegister} >
          <View style={styles.btn}>
            <Text style={styles.btnTxt}>Register</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default Register;

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
    padding:7,
    color:"black"
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
});
