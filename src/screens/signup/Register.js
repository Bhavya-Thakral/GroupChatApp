import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CommonActions} from '@react-navigation/native';
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {ref, set} from 'firebase/database';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {database, auth} from '../../../firebase/firebase';
import {PickImage} from '../../extras/PickImage';
import {uploadImage} from '../../extras/StoreToFirebase';
import {useChat} from '../../Context/Context';
import {firebase} from '@react-native-firebase/messaging';
import MainScreen from '../../extras/MainScreen';

const Register = ({navigation}) => {
  const [displayName, setDisplayName] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const {setCurrentUser} = useChat();
  const [loading, setIsLoading] = useState(false);

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
          token: userToken,
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

  async function handleUpdateUser() {
    setIsLoading(true);
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
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('userToken', userToken);
    await set(ref(database, `users/${user.uid}`), {
      email: user.email,
      name: displayName,
      phnNo: phoneNumber,
      photoURL: imageUri,
      token: userToken,
    });
    setCurrentUser(user);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );
    setIsLoading(false);
  }

  return (
    <MainScreen
      head={'Create Your Account'}
      subHead={'Enter the fields below te get started'}
      onPress={handleUpdateUser}
      loading={loading}>
      {imageUri === '' ? (
        <Pressable onPress={pickImgHandler} disabled={isUploadingImage}>
          <View
            style={{
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
              width: 150,
              height: 150,
              borderRadius: 75,
              borderColor: '#273567',
              paddingTop: 20,
            }}>
            {isUploadingImage ? (
              <ActivityIndicator size={'small'} color={'#273567'} />
            ) : (
              <>
                <Icon name="user" size={100} color={'#273567'} />
                <View
                  style={{
                    position: 'relative',
                    left: 50,
                    backgroundColor: '#273567',
                    width: 30,
                    aspectRatio: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 15,
                    bottom: 10,
                  }}>
                  <Icon name="plus" size={20} color={'#fff'} />
                </View>
              </>
            )}
          </View>
        </Pressable>
      ) : (
        // <View style={{position: 'relative'}}>
        //   {isUploadingImage ? (
        //     <Pressable
        //       style={{
        //         alignSelf: 'center',
        //         alignItems: 'center',
        //         justifyContent: 'center',
        //         backgroundColor: 'lightgrey',
        //         padding: 10,
        //         borderRadius: 50,
        //         width: 100,
        //         height: 100,
        //       }}
        //       onPress={pickImgHandler}>
        //       <Icon
        //         name={isUploadingImage ? 'spinner' : 'user'}
        //         size={50}
        //         color={'blue'}
        //       />
        //     </Pressable>
        //   ) : (
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
      {/* // </View> */}
      {/* )} */}

      <View style={styles.content}>
        <Text style={styles.contentHead}>Full Name</Text>
        <TextInput
          placeholder="Enter your full name"
          style={styles.input}
          placeholderTextColor={'#C9CDD2'}
          onChangeText={setDisplayName}
        />
      </View>
    </MainScreen>
  );
};

export default Register;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    alignItems: 'center',

    gap: 20,
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
  img: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
});
