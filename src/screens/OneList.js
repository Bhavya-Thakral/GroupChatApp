import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {auth, database} from '../../firebase/firebase';
import {onValue, ref} from 'firebase/database';
import {signOut} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useChat} from '../Context/Context';

const OneList = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const user = auth.currentUser;
  const {setCurrentChat} = useChat();
  // console.log('currentUser in one', currentUser);
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
  }, [user]);
  // console.log('user', user);

  async function logoutHandler() {
    await signOut(auth);
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: user.displayName || 'Chat',
      // headerRight: () => {
      //   return (
      //     <View style={{flexDirection: 'row'}}>
      //       <Pressable
      //         //   onPress={createHandler}
      //         style={({pressed}) => {
      //           pressed && styles.press;
      //         }}>
      //         <Icon
      //           name="adduser"
      //           size={20}
      //           color={'#131313'}
      //           style={{marginRight: 20}}
      //         />
      //       </Pressable>
      //       <Pressable
      //         onPress={logoutHandler}
      //         style={({pressed}) => {
      //           pressed && styles.press;
      //         }}>
      //         <Icon
      //           name="logout"
      //           size={20}
      //           color={'#131313'}
      //           style={{marginRight: 20}}
      //         />
      //       </Pressable>
      //     </View>
      //   );
      // },
      headerLeft: () => {
        return (
          user?.photoURL && (
            <Image
              source={{uri: user?.photoURL}}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginLeft: 10,
                backgroundColor: 'lightgrey',
              }}
            />
          )
          // <Image
          //   source={user?.photoURL}
          //   style={{width: 20, height: 20, borderRadius: 10}}
          // />
        );
      },
    });
  }, []);

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
        style={styles.viewChat}
        onPress={onSelectedChat.bind(this, item)}>
        <>
          {item.photoURL ? (
            <Image
              source={{uri: item.photoURL}}
              style={{width: 50, height: 50, borderRadius: 25, marginRight: 10}}
            />
          ) : (
            <View
              style={{
                width: 50,
                height: 50,
                borderWidth: 1,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}>
              <Icon name="user" size={20} color={'#131313'} />
            </View>
          )}

          <Text style={styles.head}>{item.name}</Text>
        </>
      </Pressable>
    );
  };

  return (
    <View style={styles.main}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default OneList;

const styles = StyleSheet.create({
  viewChat: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#131313',
    backgroundColor: 'lightgrey',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  head: {
    color: '#131313',
    fontSize: 18,
  },
  main: {
    marginVertical: 10,
  },
});
