// screens/CreateGroupScreen.js
import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  Text,
  Image,
} from 'react-native';
import {database, auth} from '../../firebase/firebase';
import {ref, push, update} from 'firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome';
import {PickImage} from '../extras/PickImage';
import {Alert} from 'react-native';
import {uploadImage} from '../extras/StoreToFirebase';

const CreateGroup = ({navigation}) => {
  const [groupName, setGroupName] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleCreateGroup = async () => {
    if (groupName) {
      const user = auth.currentUser;
      const groupsRef = ref(database, 'groups/');
      const newGroupRef = await push(groupsRef, {
        name: groupName,
        members: {},
        profile: imageUri,
      });

      if (user) {
        const groupMembersRef = ref(
          database,
          `groups/${newGroupRef.key}/members`,
        );
        await update(groupMembersRef, {[user.uid]: true});
      }

      // Navigate to the group chat screen with the new group ID
      navigation.navigate('ChatList', {
        chatType: 'groups',
        groupId: newGroupRef.key,
        chatName: groupName,
      });
    }
  };

  // function pickImgHandler() {
  //   if (!!isUploadingImage) {
  //     return;
  //   }
  //   pickImg();
  // }

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

  return (
    <View style={styles.container}>
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
              disabled={!!isUploadingImage}
              onPress={pickImg}>
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
              disabled={!!isUploadingImage}
              onPress={pickImg}>
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
                onPress={pickImg}>
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
                onPress={pickImg}>
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
              onPress={pickImg}>
              <Icon name={'camera'} size={20} color={'blue'} />
            </Pressable>
          </View>
        )}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
        placeholderTextColor={'#1313'}
      />

      <Pressable
        style={({pressed}) => pressed && styles.pressed}
        onPress={handleCreateGroup}>
        <View style={styles.btn}>
          <Text style={styles.btnTxt}>Create</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 7,
    color: 'black',
    marginBottom: 10,
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

export default CreateGroup;
