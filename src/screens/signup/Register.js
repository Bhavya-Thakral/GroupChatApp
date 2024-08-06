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

const Register = ({navigation, route}) => {
  const [displayName, setDisplayName] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const {setCurrentUser} = useChat();
  const [loading, setIsLoading] = useState(false);
  const {userCredential} = route.params;

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
          name: displayName,

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
    console.log('user credential:', userCredential);
    setIsLoading(true);
    const user = userCredential.uid;
    if (user) {
      console.log('User object:', JSON.stringify(user, 2, 0));
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
    await AsyncStorage.setItem('user', JSON.stringify(user, 2, 0));
    await AsyncStorage.setItem('userToken', userToken);
    await set(ref(database, `users/${user.uid}`), {
      name: displayName,
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
            }}>
            {isUploadingImage ? (
              <ActivityIndicator size={'small'} color={'#273567'} />
            ) : (
              <>
                <View
                  style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {/* <Icon name="user" size={100} color={'#273567'} /> */}
                  <Image
                    source={require('../../../public/assets/images/user.png')}
                    style={styles.img}
                  />
                </View>

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
                    top: 50,
                  }}>
                  <Icon name="plus" size={20} color={'#fff'} />
                </View>
              </>
            )}
          </View>
        </Pressable>
      ) : isUploadingImage ? (
        <View
          style={{
            width: 150,
            height: 150,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={'small'} color={'#273567'} />
        </View>
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
