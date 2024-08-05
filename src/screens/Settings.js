import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Image} from 'react-native';
import {signOut} from 'firebase/auth';
import Dialog from '../extras/Dialog';
import {auth} from '../../firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {set} from 'date-fns';
const Settings = ({navigation}) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  const user = auth.currentUser;
  useEffect(() => {
    setName(user.displayName);
    setEmail(user.email);
    setPhone(user.phoneNumber);
    setImage(user.photoURL);
  });

  const userSettings = [
    {
      img: require('../../public/assets/images/account.png'),
      name: 'Account',
      onPress: () => {
        navigation.navigate('Account');
      },
    },
    {
      img: require('../../public/assets/images/privacy.png'),
      name: 'Privacy',
      onPress: () => {
        navigation.navigate('Privacy');
      },
    },
    {
      img: require('../../public/assets/images/help.png'),
      name: 'Help',
      onPress: () => {
        navigation.navigate('Help');
      },
    },
    {
      img: require('../../public/assets/images/language.png'),
      name: 'Language',
      onPress: () => {
        navigation.navigate('Language');
      },
    },
    {
      img: require('../../public/assets/images/logout.png'),
      name: 'Logout',
      onPress: logoutHandler,
    },
  ];

  const showDialog = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const handleConfirm = async () => {
    // Handle the confirmation action here
    await signOut(auth);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('userToken');
    await ZegoUIKitPrebuiltCallService.uninit();
    navigation.replace('Login');
    console.log('Confirmed');
    hideDialog();
  };

  async function logoutHandler() {
    showDialog();
  }

  return (
    <View style={styles.main}>
      <View style={styles.about}>
        <Image
          source={{
            uri: image,
          }}
          style={styles.img}
        />
        <View style={{flex: 1}}>
          <Text style={{color: '#fff', fontSize: 16, fontWeight: '600'}}>
            {name}
          </Text>
          {phone ? (
            <Text style={{color: '#fff', fontSize: 13, fontWeight: '500'}}>
              {phone}
            </Text>
          ) : (
            <Text style={{color: '#fff', fontSize: 13, fontWeight: '500'}}>
              {email}
            </Text>
          )}
        </View>
        <Pressable onPress={() => navigation.navigate('Profile')}>
          <Icon name="pen" size={20} color={'#fff'} style={styles.icon} />
        </Pressable>
      </View>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          {userSettings.map((item, index) => {
            return (
              <Pressable
                style={styles.search}
                key={index}
                onPress={item.onPress}>
                <View style={styles.list}>
                  <Image source={item.img} />
                </View>
                <View style={styles.name}>
                  <Text style={styles.text}>{item.name}</Text>
                </View>
                {item.name !== 'Logout' && (
                  <Icon name="chevron-right" size={20} color={'#9EA4AA'} />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
      <Dialog
        visible={dialogVisible}
        onClose={hideDialog}
        title="Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleConfirm}
      />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#185389',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  input: {
    color: '#26282B',
    fontSize: 16,
  },
  icon: {
    margin: 10,
    alignSelf: 'center',
  },
  textContainer: {
    borderWidth: 1,
    borderColor: '#E8EBED',
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 25,
    margin: 10,
    marginTop: 20,
    height: 50,
    width: '90%',
  },
  searchContainer: {
    // marginTop: 20,
    padding: 10,
    paddingHorizontal: 20,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#fff',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBED',
  },
  text: {
    color: '#26282B',
    fontSize: 14,
    fontWeight: '600',
  },
  name: {
    flex: 1,
  },
  about: {
    padding: 20,
    flexDirection: 'row',
  },
  list: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D0E3FF4D',
    borderRadius: 8,
    marginRight: 10,
  },
});
