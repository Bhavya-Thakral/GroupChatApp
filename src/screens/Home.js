import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome6';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {auth, database} from '../../firebase/firebase';
import {onValue, ref} from 'firebase/database';
import {signOut} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useChat} from '../Context/Context';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';

const Home = ({navigation, route}) => {
  const {userCredential} = route.params || {};
  const [users, setUsers] = useState([]);
  const user = auth.currentUser;
  const {setCurrentChat} = useChat();
  console.log('currentUser in one', auth, user);

  useEffect(() => {
    const usersRef = ref(database, 'users');
    onValue(usersRef, snapshot => {
      const data = snapshot.val();
      const usersArray = [];
      if (data) {
        Object.keys(data).forEach(key => {
          if (key !== user.uid) {
            usersArray.push({id: key, ...data[key]});
          }
        });
      }
      setUsers(usersArray);
    });
    console.log();
  }, [user]);

  useEffect(() => {
    console.log('user', userCredential);

    onUserLogin(user.uid, user.displayName).then(() => {
      const id = user.uid;
      const name = user.displayName;
      console.log('storing ', id, name);
      storeUserInfo({id, name});
    });
  }, []);
  // console.log('user', user);

  async function logoutHandler() {
    await signOut(auth);
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Chat App',
      headerRight: () => {
        return (
          <Pressable
            // onPress={addUserHandler}
            style={({pressed}) => {
              pressed && styles.press;
            }}>
            <Icon1
              name="plus"
              size={20}
              color={'#fff'}
              style={{marginRight: 40}}
            />
          </Pressable>
        );
      },
    });
  }, []);

  const storeUserInfo = async info => {
    await AsyncStorage.setItem('userID', info.id);
    await AsyncStorage.setItem('userName', info.name);
    console.log('setting user id', info.id);
  };

  const onUserLogin = async (userID, userName) => {
    return ZegoUIKitPrebuiltCallService.init(
      97492,
      'e930226544e43d2a3b39fc6c0721dfcf7f1f26c6b5f7a258a223f57ba5220e67',
      userID,
      userName,
      [ZIM, ZPNs],
      // notifyWhenAppRunningInBackgroundOrQuit,
      {
        ringtoneConfig: {
          incomingCallFileName: 'zego_incoming.mp3',
          outgoingCallFileName: 'zego_outgoing.mp3',
        },
        androidNotificationConfig: {
          channelID: 'ZegoUIKit',
          channelName: 'ZegoUIKit',
        },
      },
    );
  };

  function onSelectedChat(item) {
    setCurrentChat(item);
    navigation.navigate('DirectChat', {
      chatType: 'directMessages',
      userId: item.id,
      chatName: item.name,
    });
  }

  const renderItem = ({item}) => {
    return (
      <Pressable
        style={[styles.viewChat, styles.search]}
        onPress={onSelectedChat.bind(this, item)}>
        <>
          {item.photoURL ? (
            <Image source={{uri: item.photoURL}} style={styles.img} />
          ) : (
            <View
              style={[
                styles.img,
                {alignItems: 'center', justifyContent: 'center'},
              ]}>
              <Icon name="user" size={20} color={'#131313'} />
            </View>
          )}
          <View style={{flex: 1}}>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={[styles.msg, {color: '#787878'}]}>Recent msg</Text>
          </View>
          <Text style={{color: '#9EA4AA'}}>1:20pm</Text>
        </>
      </Pressable>
    );
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <View
          style={({pressed}) => [
            styles.searchContainer,
            pressed && {backgroundColor: '#D0E3FF'},
            selectedUsers.includes(item.id) && {backgroundColor: '#D0E3FF'},
          ]}>
          <FlatList
            data={users}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  viewChat: {
    padding: 10,

    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    backgroundColor: '#185389',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    overflow: 'hidden',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#9EA4AA',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBED',
    marginHorizontal: 15,
  },
  text: {
    color: '#26282B',
    fontSize: 16,
    fontWeight: '600',
  },
  name: {
    flex: 1,
  },
  msg: {
    color: '#26282B',
    fontSize: 12,
    fontWeight: '600',
  },
});
