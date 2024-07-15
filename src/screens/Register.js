// import { Pressable, StyleSheet,TextInput, Text, View, Alert} from 'react-native';
// import React, { useState } from 'react';
// import { CommonActions } from '@react-navigation/native';
// import { getAuth } from 'firebase/auth';
// import {auth, database} from '../../firebase/firebase';
// import { createUserWithEmailAndPassword ,updateProfile ,signInWithPhoneNumber } from 'firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ref, set, update } from 'firebase/database';
// import { Image } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { PickImage } from './PickImage';
// import { uploadImage } from './StoreToFirebase';

// const Register = ({navigation}) => {
//   const [email,setEmail]=useState('');
//   const [password,setPassword]=useState("");
//   const [displayName, setName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [imageUri, setImageUri] = useState('');
//   const [isUploadingImage, setIsUploadingImage] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);
//   const [isVerifing, setIsVerifing] = useState(false);
//   const [confirmation, setConfirmation] = useState(null);
//   const [OTP, setOTP] = useState('');

//   console.log(phoneNumber,'phoneNumber');
//   console.log(confirmation,'confirmation');

//     const handleRegister = () => {
//       createUserWithEmailAndPassword(auth,email,password)
//         .then(async (userCredential) => {
//           const user = userCredential.user;
//           try {
//             await updateProfile(user, {
//               displayName: displayName,
//               photoURL: imageUri,
//             });
//             console.log("Profile updated successfully");
//           } catch (error) {
//             console.error("Error updating profile:", error);
//           }
//           await AsyncStorage.setItem('user', JSON.stringify(user));
//           await set(ref(database, `users/${user.uid}`), {
//             email: user.email,
//             name: displayName,
//             phnNo: phoneNumber,
//             photoURL: imageUri,
//           });
//           navigation.dispatch(
//             CommonActions.reset({
//               index: 0,
//               routes: [{ name: 'MyTabs' }],
//             })
//           );
//         })
//         .catch((error) => {
//           const errorMessage = error.message;
//           Alert.alert('Error', errorMessage);
//         });
//   }

//   function pickImgHandler()
//   {
//     if(!!isUploadingImage){
//       return;
//     }
//     pickImg();
//   }

//   function pickImg() {
//     setIsUploadingImage(true);
//     PickImage(async image => {
//       try {
//         const imageUrl = await uploadImage(image);
//         setImageUri(imageUrl);
//         // Alert.alert('Media sent', 'Media sent successfully');
//       } catch (err) {
//         Alert.alert('Error', err.message);
//       } finally {
//         setIsUploadingImage(false);
//       }
//     });
//   }

//   // async function sendVerificationCode(phoneNumber) {
//   //   console.log('Sending verification code to:', phoneNumber);
//   //   try {
//   //     setIsVerifing(true);
//   //     console.log("1");
//   //     const confirmationResult = await signInWithPhoneNumber(auth,phoneNumber);
//   //     console.log("2");

//   //     setIsVerifing(false);
//   //     console.log("3");

//   //     setConfirmation(confirmationResult);
//   //     return confirmationResult;
//   //   } catch (error) {
//   //     console.error("Error sending verification code:", error.message);
//   //     Alert.alert('Error', 'Failed to send verification code. Please try again.');
//   //     setIsVerifing(false);
//   //   }
//   // }

//   // function sendVerificationCodeHandler() {
//   //   if (phoneNumber.length !== 10) {
//   //     Alert.alert('Error', 'Please enter a valid phone number');
//   //     return;
//   //   }
//   //   let newPhone = '+91 ' + phoneNumber;
//   //   sendVerificationCode(newPhone).then((confirmation) => {
//   //     console.log(confirmation);
//   //   }
//   //   ).catch((error) => {
//   //     console.log(error);
//   //   })

//   // }

//   async function sendVerificationCodeHandler(phoneNumber) {
//     try{
//       const newPhone = '+91 ' + phoneNumber;
//       console.log('Sending verification code to:', newPhone);
//       const confirmation = await signInWithPhoneNumber(auth,newPhone);
//       console.log("returned confirmation",confirmation);
//       setConfirmation(confirmation);
//     }
//     catch(error){
//       console.log(error);
//     }
//   }

//   async function verifyCode(confirmation, code) {
//     try {
//       await confirmation.confirm(code);
//       console.log('Phone number verified and user signed in!');
//       setIsVerified(true);
//     } catch (error) {
//       console.error("Invalid code:", error.message);
//       Alert.alert('Error', 'Invalid code. Please try again.');
//     }
//   }

//   function verifyCodeHandler() {
//     if (OTP.length !== 6) {
//       Alert.alert('Error', 'Please enter a correct OTP');
//       return;
//     }
//     verifyCode(confirmation, OTP);
//   }

//   return (
//     <View style={styles.main}>
//       <View style={{alignSelf: 'center', width: '100%',justifyContent:'center'}}>
//         {imageUri === '' ?
//         <View style={{ position:'relative'}} >
//         <Pressable style={{alignSelf:'center',alignItems:'center',justifyContent:'center' , backgroundColor:'lightgrey',padding:10,borderRadius:100,width:100,height:100}} onPress={pickImgHandler} >
//             <Icon name={ isUploadingImage ? 'spinner': "user"} size={50} color={'blue'} />
//         </Pressable>
//         <Pressable style={{ position:'absolute', zIndex:11111, bottom:0, right:'40%' }} onPress={pickImgHandler} >
//             <Icon name={ 'camera'} size={20} color={'blue'} />
//         </Pressable>
//         </View>
//        :
//        <View style={{position:'relative'}} >
//        { isUploadingImage ?  <Pressable style={{alignSelf:'center',alignItems:'center',justifyContent:'center' , backgroundColor:'lightgrey',padding:10,borderRadius:100,width:100,height:100}} onPress={pickImgHandler} >
//             <Icon name={ isUploadingImage ? 'spinner': "user"} size={50} color={'blue'} />
//         </Pressable> :
//        <Pressable style={{alignSelf:'center',alignItems:'center',justifyContent:'center'}} onPress={pickImgHandler}>
//          <Image source={{ uri: imageUri }} style={styles.img}  />
//        </Pressable>

//         }
//        <Pressable style={{ position:'absolute', zIndex:11111, bottom:0, right:'40%' }} onPress={pickImgHandler} >
//             <Icon name={ 'camera'} size={20} color={'blue'} />
//         </Pressable>
//        </View>
//       }
//       </View>
//       <View style={{alignSelf: 'flex-start', width: '100%'}}>
//         <Text style={styles.subHead}>Name</Text>
//         <TextInput style={styles.input} onChangeText={setName} value={displayName} placeholder='Enter Name' placeholderTextColor={"black"} />
//       </View>
//       <View style={{alignSelf: 'flex-start', width: '100%'}}>
//         <Text style={styles.subHead}>Phone No.</Text>
//         <View style={{flexDirection:'row', width: '100%'}} >
//         <View style={{flex:7}} >
//         <TextInput style={styles.input} onChangeText={setPhoneNumber} keyboardType='number-pad' maxLength={10} value={phoneNumber} placeholder='Enter Phone No.' placeholderTextColor={"black"} />

//           </View>
//         <Pressable style={{flex:1,alignItems:'center',justifyContent:'center',padding:5}} onPress={sendVerificationCodeHandler.bind(this,phoneNumber)} >
//           <Text style={{fontSize:16 , color:'blue'}}>
//            { isVerified ? 'Verified': 'Verify' }
//           </Text>
//         </Pressable>
//         </View>
//       </View>

//       { isVerifing && isVerified &&
//       <View style={{alignSelf: 'flex-start', width: '100%'}}>
//       <Text style={styles.subHead}>OTP</Text>
//       <View style={{flexDirection:'row', width: '100%'}} >
//       <View style={{flex:7}} >
//       <TextInput style={styles.input} onChangeText={setOTP} keyboardType='number-pad' maxLength={10} value={OTP} placeholder='Enter OTP' placeholderTextColor={"black"} />

//         </View>
//       <Pressable style={{flex:1,alignItems:'center',justifyContent:'center',padding:5}} onPress={verifyCodeHandler} >
//         <Text style={{fontSize:16 , color:'blue'}}>
//          { isVerified ? 'Verified': 'Verify' }
//         </Text>
//       </Pressable>
//       </View>
//     </View>

//       }

//       <View style={{alignSelf: 'flex-start', width: '100%'}}>
//         <Text style={styles.subHead}>Email</Text>

//         <TextInput style={styles.input} onChangeText={setEmail} keyboardType='email-address' value={email} placeholder='Enter Email' placeholderTextColor={"black"} />
//       </View>
//       <View style={{alignSelf: 'flex-start', width: '100%'}}>
//         <Text style={styles.subHead}>Password</Text>
//         <TextInput style={styles.input} placeholderTextColor={"black"} placeholder='Enter password' value={password} onChangeText={setPassword} secureTextEntry />
//       </View>
//       <View style={{alignSelf: 'flex-start', width: '100%', gap: 10}}>
//         <Pressable onPress={handleRegister} >
//           <View style={styles.btn}>
//             <Text style={styles.btnTxt}>Register</Text>
//           </View>
//         </Pressable>
//       </View>
//     </View>
//   );
// };

// export default Register;

// const styles = StyleSheet.create({
//   main: {
//     flex: 1,
//     width: '100%',
//     alignItems: 'center',
//     padding: 20,
//     gap: 20,

//   },
//   head: {
//     color: 'black',
//     fontSize: 16,
//     fontWeight: '800',
//   },
//   subHead: {
//     color: 'black',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   input: {
//     borderWidth: 1,
//     borderRadius: 5,
//     width: '100%',
//     padding:7,
//     color:"black",
//   },
//   btn1: {
//     fontSize: 12,
//     textDecorationLine: 'underline',
//     color: 'blue',
//   },
//   btn: {
//     backgroundColor: 'blue',
//     height: 40,
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   btnTxt: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   img: {
//     width: 100,
//     height: 100,
//     borderRadius:50
//   },
// });

import {
  Pressable,
  StyleSheet,
  TextInput,
  Text,
  View,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CommonActions} from '@react-navigation/native';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  updatePhoneNumber,
} from 'firebase/auth';
import {ref, set} from 'firebase/database';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {database, auth} from '../../firebase/firebase';
import {PickImage} from './PickImage';
import {uploadImage} from './StoreToFirebase';
import PhoneAuth from './PhoneAuth';
import {useChat} from '../Context/Context';
import {firebase} from '@react-native-firebase/messaging';

const Register = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const {setCurrentUser} = useChat();

  useEffect(() => {
    async function getToken() {
      const token = await firebase.messaging().getToken();
      setUserToken(token);
    }
    getToken();
    // console.log('User token:', userToken);
  }, []);

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async userCredential => {
        const user = userCredential.user;
        if (user) {
          console.log('User object:', user);
          try {
            await updateProfile(user, {
              displayName: displayName,
              photoURL: imageUri,
            });
            console.log('Profile updated successfully');
          } catch (error) {
            console.error('Error updating profile:', error);
          }
        } else {
          console.error('User object is undefined.');
        }
        // updatePhoneNumber(user, phoneNumber)
        //   .then(() => {
        //     console.log('Phone number updated successfully');
        //   })
        //   .catch(error => {
        //     console.error('Error updating phone number:', error.message);
        //   });
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('userToken', userToken);
        await set(ref(database, `users/${user.uid}`), {
          email: user.email,
          name: displayName,
          phnNo: phoneNumber,
          photoURL: imageUri,
        });
        setCurrentUser(user);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'MyTabs'}],
          }),
        );
      })
      .catch(error => {
        const errorMessage = error.message;
        Alert.alert('Error', errorMessage);
      });
  };

  function pickImgHandler() {
    if (!!isUploadingImage) {
      return;
    }
    pickImg();
  }

  function pickImg() {
    setIsUploadingImage(true);
    PickImage(async image => {
      try {
        const imageUrl = await uploadImage(image);
        setImageUri(imageUrl);
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setIsUploadingImage(false);
      }
    });
  }

  function setPhoneHandler(phone) {
    setPhoneNumber(phone);
  }

  return (
    <View style={styles.main}>
      <View
        style={{alignSelf: 'center', width: '100%', justifyContent: 'center'}}>
        {imageUri === '' ? (
          <View style={{position: 'relative'}}>
            <Pressable
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'lightgrey',
                padding: 10,
                borderRadius: 100,
                width: 100,
                height: 100,
              }}
              onPress={pickImgHandler}>
              <Icon
                name={isUploadingImage ? 'spinner' : 'user'}
                size={50}
                color={'blue'}
              />
            </Pressable>
            <Pressable
              style={{
                position: 'absolute',
                zIndex: 11111,
                bottom: 0,
                right: '40%',
              }}
              onPress={pickImgHandler}>
              <Icon name={'camera'} size={20} color={'blue'} />
            </Pressable>
          </View>
        ) : (
          <View style={{position: 'relative'}}>
            {isUploadingImage ? (
              <Pressable
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'lightgrey',
                  padding: 10,
                  borderRadius: 100,
                  width: 100,
                  height: 100,
                }}
                onPress={pickImgHandler}>
                <Icon
                  name={isUploadingImage ? 'spinner' : 'user'}
                  size={50}
                  color={'blue'}
                />
              </Pressable>
            ) : (
              <Pressable
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={pickImgHandler}>
                <Image source={{uri: imageUri}} style={styles.img} />
              </Pressable>
            )}
            <Pressable
              style={{
                position: 'absolute',
                zIndex: 11111,
                bottom: 0,
                right: '40%',
              }}
              onPress={pickImgHandler}>
              <Icon name={'camera'} size={20} color={'blue'} />
            </Pressable>
          </View>
        )}
      </View>
      <View style={{alignSelf: 'flex-start', width: '100%'}}>
        <Text style={styles.subHead}>Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setDisplayName}
          value={displayName}
          placeholder="Enter Name"
          placeholderTextColor={'black'}
        />
      </View>
      <PhoneAuth setPhone={setPhoneHandler} />
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
  img: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
