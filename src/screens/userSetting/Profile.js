import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import Dialog from '../../extras/Dialog';
import {TextInput} from 'react-native-gesture-handler';
import {auth, database} from '../../../firebase/firebase';
import {useNavigation} from '@react-navigation/native';
import {PickImage} from '../../extras/PickImage';
import {uploadImage} from '../../extras/StoreToFirebase';

import {ref, set} from 'firebase/database';
import {updateProfile} from 'firebase/auth';

const Profile = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const navigation = useNavigation();

  console.log('name', name);

  useEffect(() => {
    const user = auth.currentUser;
    console.log(user);
    setName(user.displayName);
    setEmail(user.email);
    setImage(user.photoURL);
  }, [auth.currentUser]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={onSaveHandler}>
          <Icon
            name="save"
            size={26}
            color={'#fff'}
            style={{marginRight: 20}}
          />
        </Pressable>
      ),
    });
  }, [navigation, onSaveHandler]);

  function onSaveHandler() {
    const user = auth.currentUser;
    updateProfile(user, {
      displayName: name,
      photoURL: image,
    })
      .then(() => {
        set(ref(database, `users/${user.uid}`), {
          name: name,
          photoURL: image,
        });
        console.log('Profile updated successfully');
        Alert.alert('Success', 'Profile updated successfully');
      })
      .catch(err => {
        Alert.alert('Error', err.message);
      });
  }

  function onPressHandler() {
    console.log('Edit');
    setEditName(name);
    setDialogVisible(true);
  }

  const hideDialog = () => {
    setDialogVisible(false);
  };
  const handleConfirm = async () => {
    // Handle the confirmation action here
    console.log('Confirmed');
    setName(editName);
    hideDialog();
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
        setImage(imageUrl);
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setIsUploadingImage(false);
      }
    });
  }

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <Pressable style={styles.press} onPress={pickImgHandler}>
          <View style={styles.insidePress}>
            <View style={{position: 'relative'}}>
              <Image source={{uri: image}} style={styles.img} />
              <View style={styles.camera}>
                <Icon1 name="camera" size={26} color={'#fff'} />
              </View>
            </View>
          </View>
        </Pressable>
        <View style={styles.border}>
          <View style={styles.content}>
            <Icon1 name="user" color={'#185389'} size={26} />
            <View style={{flex: 1}}>
              <Text style={styles.head}>Name</Text>
              <Text style={[styles.text]}>{name}</Text>
            </View>
            <Pressable onPress={onPressHandler}>
              <Icon1
                name="pen"
                size={20}
                color={'#185389'}
                style={styles.icon}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.border}>
          <View style={styles.content}>
            <Icon name="mail" color={'#185389'} size={26} />
            <View style={{flex: 1}}>
              <Text style={styles.head}>Email</Text>
              <Text style={styles.text}>Bhavya@gmail.com</Text>
            </View>
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={dialogVisible}
          onRequestClose={hideDialog}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Edit Your Name</Text>
              <View style={{width: '90%', marginBottom: 40}}>
                <Text style={styles.modalText}>Enter your Name</Text>
                <TextInput
                  placeholder="Enter here"
                  defaultValue={editName}
                  style={styles.input}
                  placeholderTextColor={'#9EA4AA'}
                  onChangeText={setEditName}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Pressable onPress={hideDialog} style={styles.btn}>
                  <Text style={styles.btnText1}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirm}
                  style={[styles.btn, {backgroundColor: '#D0E3FF'}]}>
                  <Text style={[styles.btnText, {color: '#273567'}]}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#185389',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 20,
    paddingTop: 20,
  },
  press: {
    marginHorizontal: 20,
  },
  insidePress: {
    gap: 10,
    alignItems: 'center',
    margin: 10,
  },
  head: {
    color: '#9EA4AA',
    fontSize: 12,
    fontWeight: '500',
  },
  text: {
    color: '#26282B',
    fontSize: 14,
    fontWeight: '600',
  },
  img: {
    height: 200,
    width: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#185389',
  },
  camera: {
    position: 'absolute',
    width: 50,
    height: 50,
    bottom: 0,
    right: 15,
    backgroundColor: '#185389',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginHorizontal: 20,
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBED',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
  },
  modalText: {
    textAlign: 'flex-start',
    color: '#273567',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    gap: 10,
  },
  btn: {
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#185389',
    flex: 1,
    alignItems: 'center',
  },
  btnText: {
    color: '#273567',
    fontWeight: '600',
    fontSize: 16,
  },
  btnText1: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    height: 40,
    padding: 8,
    color: 'black',
    borderColor: '#C9CDD2',
  },
});
