import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome6';
import {auth, database} from '../../firebase/firebase';
import {ref, onValue, update} from 'firebase/database';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {signOut} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from 'react-native';
import {useChat} from '../Context/Context';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';

const ChatList = ({navigation}) => {
  const [userGroups, setUserGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const user = auth.currentUser;
  const {currentUser} = useChat();

  const userToken = AsyncStorage.getItem('userToken');
  console.log('userToken', userToken);

  // console.log('currentUser', currentUser);
  // console.log(userGroups, 'userGroups');
  // console.log(availableGroups, 'availableGroups');

  useEffect(() => {
    if (user) {
      const userGroupsRef = ref(database, 'groups');
      onValue(userGroupsRef, snapshot => {
        const data = snapshot.val();
        const userGroupsArray = [];
        const availableGroupsArray = [];
        if (data) {
          Object.keys(data).forEach(key => {
            const group = data[key];
            if (group.members && group.members[user.uid]) {
              userGroupsArray.push({id: key, ...group});
            } else {
              availableGroupsArray.push({id: key, ...group});
            }
          });
        }
        setUserGroups(userGroupsArray);
        setAvailableGroups(availableGroupsArray);
      });
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${currentUser?.displayName}'s Groups` || 'Groups',
      headerRight: () => {
        return (
          <View style={{flexDirection: 'row'}}>
            <Pressable
              onPress={createHandler}
              style={({pressed}) => {
                pressed && styles.press;
              }}>
              <Icon
                name="addusergroup"
                size={20}
                color={'#131313'}
                style={{marginRight: 20}}
              />
            </Pressable>
            <Pressable
              onPress={logoutHandler}
              style={({pressed}) => {
                pressed && styles.press;
              }}>
              <Icon
                name="logout"
                size={20}
                color={'#131313'}
                style={{marginRight: 20}}
              />
            </Pressable>
          </View>
        );
      },
    });
  }, []);

  async function logoutHandler() {
    await signOut(auth);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('userToken');
    await ZegoUIKitPrebuiltCallService.uninit();
    navigation.replace('Login');
  }

  function createHandler() {
    return navigation.navigate('CreateGroup');
  }

  const joinGroup = async groupId => {
    const user = auth.currentUser;
    if (user) {
      const groupMembersRef = ref(database, `groups/${groupId}/members`);
      await update(groupMembersRef, {[user.uid]: true});
    }
  };

  return (
    <>
      <Text style={styles.sectionHeader}>My Groups</Text>
      <View style={styles.main}>
        <FlatList
          data={userGroups}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <Pressable
              style={({pressed}) =>
                pressed ? [styles.chat, styles.press] : styles.chat
              }
              onPress={() =>
                navigation.navigate('DirectChat', {
                  chatType: 'groups',
                  userId: item.id,
                  chatName: item.name,
                })
              }>
              {/* <Icon1
                name="user-group"
                size={20}
                color={'#131313'}
                style={{marginRight: 10}}
              />
              <Text style={styles.item}>{item.name}</Text> */}

              {item.profile ? (
                <Image
                  source={{uri: item.profile}}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 10,
                  }}
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
                  <Icon1 name="user-group" size={20} color={'#131313'} />
                </View>
              )}
              <Text style={styles.item}>{item.name}</Text>
            </Pressable>
          )}
        />
      </View>

      <Text style={styles.sectionHeader}>Available Groups</Text>
      <View style={styles.main}>
        <FlatList
          data={availableGroups}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.groupContainer}>
              <Text style={styles.item}>{item.name}</Text>
              <Button title="Join Group" onPress={() => joinGroup(item.id)} />
            </View>
          )}
        />
      </View>
    </>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  chat: {
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
  main: {
    width: '100%',
    padding: 10,
  },
  text: {
    color: '#131313',
    fontSize: 18,
  },
  press: {
    opacity: 0.75,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'black',
    padding: 10,
  },
  groupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  item: {
    paddingHorizontal: 10,
    color: '#131313',
    fontSize: 18,
  },
});
