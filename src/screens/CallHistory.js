import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, {useLayoutEffect, useState} from 'react';
import {Image} from 'react-native';
import Icon1 from 'react-native-vector-icons/FontAwesome6';
import Dialog from '../extras/Dialog';

const CallHistory = ({navigation}) => {
  const user = [
    {
      id: 'b1',
      img: 'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg',
      name: 'Bhavya',
    },
    {
      img: 'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg',
      id: 'b2',
      name: 'Rahul',
    },
    {
      img: 'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg',
      id: 'b3',
      name: 'Lakshita',
    },
    {
      img: 'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg',
      id: 'b4',
      name: 'Tanishka',
    },
  ];

  const [selected, setSelected] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  function onLongPressHandler(call) {
    setSelected(!selected);
    setSelectedUsers(prevSelectedCalls => [...prevSelectedCalls, call.id]);
  }

  function onPressHandler(call) {
    if (selected) {
      if (selectedUsers.includes(call.id)) {
        setSelectedUsers(prevSelectedCalls =>
          prevSelectedCalls.filter(item => item !== call.id),
        );
      }
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        selectedUsers.length > 0 && (
          <Pressable style={{marginRight: 15}} onPress={deleteHandler}>
            <Icon name="trash" size={20} color={'#fff'} style={styles.icon} />
          </Pressable>
        ),
      headerLeft: () => {
        return (
          selectedUsers.length > 0 && (
            <Pressable style={{marginLeft: 15}} onPress={setTouchable}>
              <Icon1
                name="xmark"
                size={24}
                color={'#fff'}
                style={styles.icon}
              />
            </Pressable>
          )
        );
      },
      title:
        !selectedUsers.length > 0
          ? 'Calls'
          : selectedUsers.length + ' selected',
    });
  }, [selectedUsers, navigation]);

  const showDialog = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const handleConfirm = async () => {
    // Handle the confirmation action here
    console.log('Confirmed');
    hideDialog();
  };

  async function deleteHandler() {
    showDialog();
  }

  const renderItem = ({item}) => (
    <Pressable
      style={({pressed}) => [
        styles.search,
        pressed && {backgroundColor: '#D0E3FF'},
        selectedUsers.includes(item.id) && {backgroundColor: '#D0E3FF'},
      ]}
      onPress={() => {
        onPressHandler(item);
      }}
      onLongPress={() => onLongPressHandler(item)}>
      <Image source={{uri: item.img}} style={styles.img} />
      <View style={styles.name}>
        <Text style={styles.text}>{item.name}</Text>
        <Text>4 mins ago</Text>
      </View>
      <View>
        <Icon name="phone" size={20} color={'#059669'} />
      </View>
    </Pressable>
  );

  function setTouchable() {
    setSelected(false);
    setSelectedUsers([]);
  }

  return (
    <TouchableWithoutFeedback onPress={setTouchable}>
      <View style={styles.main}>
        <View style={styles.container}>
          <View
            style={({pressed}) => [
              styles.searchContainer,
              pressed && {backgroundColor: '#D0E3FF'},
              selectedUsers.includes(item.id) && {backgroundColor: '#D0E3FF'},
            ]}>
            <FlatList
              data={user}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
            />
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
    </TouchableWithoutFeedback>
  );
};

export default CallHistory;

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
    resizeMode: 'contain',
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
    fontSize: 14,
    fontWeight: '600',
  },
  name: {
    flex: 1,
  },
});
