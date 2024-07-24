import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  Image,
  Alert,
  Pressable,
} from 'react-native';
import {auth, database} from '../../firebase/firebase';
import {ref, onValue, push} from 'firebase/database';
import {format, isToday, isYesterday} from 'date-fns';
import {PickImage, PickVideo, uploadDocument} from './PickImage';
import {uploadImage, uploadVideo} from './StoreToFirebase';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import {getCurrentLocation} from './LocationHelper';
import MapView, {Marker} from 'react-native-maps';
import ButtonMy from './ButtonMy';
import {useChat} from '../Context/Context';
import DocumentPicker from 'react-native-document-picker';
import {ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';

import AsyncStorage from '@react-native-async-storage/async-storage';

const DirectChat = ({route, navigation}) => {
  const {chatType, userId: chatId, chatName: chatName} = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingLocation, setIsUploadingLocation] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);

  const [userID, setUserID] = useState('');
  const [userName, setUserName] = useState('');
  const [invitees, setInvitees] = useState([]);
  console.log('invitees', invitees);
  console.log('userID', userID);
  console.log('chatId', chatId);

  const getUserInfo = async () => {
    try {
      const userID = await AsyncStorage.getItem('userID');
      const userName = await AsyncStorage.getItem('userName');
      if (userID == undefined) {
        return undefined;
      } else {
        return {userID, userName};
      }
    } catch (e) {
      return undefined;
    }
  };

  useEffect(() => {
    setInvitees([chatId]);
    getUserInfo().then(info => {
      if (info) {
        setUserID(info.userID);
        setUserName(info.userName);
        onUserLogin(info.userID, info.userName, props);
        setInvitees([chatId]);
      }
    });
  }, [chatId]);

  const {currentChat} = useChat();
  const currentUserId = auth.currentUser.uid;

  // const chatId = chatType === 'group' ? groupId : currentUserId < userId ? `${currentUserId}_${userId}` : `${userId}_${currentUserId}`;

  const flatListRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: chatName,
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          {/* <Pressable onPress={audioCallhandler}>
            <Icon1
              name="phone"
              size={24}
              color={'#131313'}
              style={{marginRight: 20}}
            />
          </Pressable>
          <Pressable>
            <Icon1
              name="video-camera"
              size={24}
              color={'#131313'}
              style={{marginRight: 20}}
            />
          </Pressable> */}
          <ZegoSendCallInvitationButton
            invitees={invitees.map(inviteeID => {
              return {userID: inviteeID};
            })}
            isVideoCall={false}
          />
          <ZegoSendCallInvitationButton
            invitees={invitees.map(inviteeID => {
              return {userID: inviteeID};
            })}
            isVideoCall={true}
          />
        </View>
      ),
      headerLeft: () => {
        return currentChat?.photoURL ? (
          <Image
            source={{uri: currentChat?.photoURL}}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              marginLeft: 10,
              backgroundColor: 'lightgrey',
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
              marginLeft: 10,
            }}>
            <Icon name="user" size={20} color={'#131313'} />
          </View>
        );
      },
    });
  }, [navigation, chatName]);

  useEffect(() => {
    const messagesRef = ref(database, `${chatType}/${chatId}/messages`);
    onValue(messagesRef, snapshot => {
      const data = snapshot.val();
      const messagesArray = [];
      if (data) {
        Object.keys(data).forEach(key => {
          const message = {id: key, ...data[key]};
          if (
            message.userId === currentUserId ||
            message.recipientId === currentUserId
          ) {
            messagesArray.push(message);
          }
        });
      }
      // Reverse to display the latest message at the bottom
      setMessages(messagesArray.reverse());
    });
  }, [chatId, currentUserId]);

  const sendMessage = async () => {
    if (text) {
      const messagesRef = ref(database, `${chatType}/${chatId}/messages`);
      await push(messagesRef, {
        userId: auth.currentUser.uid,
        text,
        timestamp: Date.now(),
        email: auth.currentUser.email,
        name: auth.currentUser.displayName,
        recipientId: chatId,
      });
      setText('');
      flatListRef.current.scrollToOffset({offset: 0, animated: true});
    }
  };

  const formatTimestamp = timestamp => {
    // Ensure the timestamp is a valid number.
    if (typeof timestamp !== 'number') {
      return 'Invalid timestamp';
    }

    const date = new Date(timestamp);

    // Check if the date is today or yesterday for special formatting, else format normally.
    if (isToday(date)) {
      return `Today ${format(date, 'HH:mm')}`;
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'dd/MM/yyyy HH:mm');
    }
  };

  const saveImageUrl = async (chatId, imageUrl) => {
    const messagesRef = ref(database, `${chatType}/${chatId}/messages`);
    await push(messagesRef, {
      img: imageUrl,
      timestamp: Date.now(),
      userId: auth.currentUser.uid,
      email: auth.currentUser.email,
      name: auth.currentUser.displayName,
      recipientId: chatId,
    });
  };

  const saveVideoUrl = async (chatId, videoUrl) => {
    const messagesRef = ref(database, `${chatType}/${chatId}/messages`);
    await push(messagesRef, {
      video: videoUrl,
      timestamp: Date.now(),
      userId: auth.currentUser.uid,
      email: auth.currentUser.email,
      name: auth.currentUser.displayName,
      recipientId: chatId,
    });
  };

  const sendImage = async () => {
    setIsUploadingImage(true);
    PickImage(async image => {
      if (!image) {
        // Check if the callback was invoked with null.
        console.log('Image selection was cancelled or failed');
        setIsUploadingImage(false);
        return; // Exit the function early.
      }
      try {
        const imageUrl = await uploadImage(image);
        await saveImageUrl(chatId, imageUrl);
        Alert.alert('Media sent', 'Media sent successfully');
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setIsUploadingImage(false);
      }
    });
  };

  const sendVideo = async () => {
    setIsUploadingVideo(true);
    PickVideo(async video => {
      if (!Video) {
        // Check if the callback was invoked with null.
        console.log('Image selection was cancelled or failed');
        setIsUploadingVideo(false);
        return; // Exit the function early.
      }
      try {
        const videoUrl = await uploadVideo(video);
        await saveVideoUrl(chatId, videoUrl);
        Alert.alert('Media sent', 'Media sent successfully');
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setIsUploadingVideo(false);
      }
    });
  };

  const saveDocumentUrl = async (chatId, documentUrl, documentName) => {
    const messagesRef = ref(database, `${chatType}/${chatId}/messages`);
    await push(messagesRef, {
      document: documentUrl,
      documentName: documentName,
      timestamp: Date.now(),
      userId: auth.currentUser.uid,
      email: auth.currentUser.email,
      name: auth.currentUser.displayName,
      recipientId: chatId,
    });
  };
  const sendDocument = async () => {
    try {
      setIsUploadingDocument(true);
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      if (!res) {
        console.log('Document selection was cancelled or failed');
        setIsUploadingDocument(false);
        return;
      }
      const documentUrl = await uploadDocument(res);
      await saveDocumentUrl(chatId, documentUrl, res.name);
      Alert.alert('Document sent', 'Document sent successfully');
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        Alert.alert('Error', err.message);
      }
    } finally {
      setIsUploadingDocument(false);
    }
  };

  const sendLocationMessage = async () => {
    const user = auth.currentUser;
    setIsUploadingLocation(true);
    if (user) {
      try {
        const location = await getCurrentLocation();
        const messagesRef = ref(database, `${chatType}/${chatId}/messages`);
        await push(messagesRef, {
          type: 'location',
          timestamp: Date.now(),
          userId: user.uid,
          email: user.email,
          name: auth.currentUser.displayName,
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          recipientId: chatId,
        });
      } catch (error) {
        console.error('Error getting location:', error);
      } finally {
        setIsUploadingLocation(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            style={[
              styles.messageContainer,
              item.senderId === currentUserId || item.userId === currentUserId
                ? styles.myMessage
                : styles.theirMessage,
            ]}>
            {item.senderId !== currentUserId &&
              item.userId !== currentUserId &&
              chatType === 'groups' && (
                <Text style={{color: 'black'}}>{item.name || item.email}</Text>
              )}

            {item.text ? (
              <Text style={{fontSize: 18, color: 'black'}}>{item.text}</Text>
            ) : null}
            {item.img ? (
              <Image source={{uri: item.img}} style={styles.img} />
            ) : null}
            {item.video ? (
              <Video
                source={{uri: item.video}}
                style={styles.img}
                paused={true}
                controls={true}
                resizeMode="contain"
              />
            ) : null}
            {item.document ? (
              <Pressable
                onPress={() => {
                  Alert.alert('Open Document', item.document);
                }}>
                <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
                  {item.documentName}
                </Text>
              </Pressable>
            ) : null}
            {item.type === 'location' && (
              <MapView
                style={{width: 200, height: 200}}
                initialRegion={{
                  latitude: item.location.latitude,
                  longitude: item.location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}>
                <Marker
                  coordinate={{
                    latitude: item.location.latitude,
                    longitude: item.location.longitude,
                  }}
                />
              </MapView>
            )}
            <Text style={styles.timestamp}>
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
        )}
        inverted={true}
      />

      <View style={{width: '100%', alignItems: 'center', gap: 15}}>
        <View style={{flexDirection: 'row', width: '100%', gap: 10}}>
          <ButtonMy
            onPress={sendLocationMessage}
            icon={isUploadingLocation ? 'spinner' : 'location-arrow'}
            disabled={!!isUploadingLocation}
          />
          <ButtonMy
            onPress={sendImage}
            icon={isUploadingImage ? 'spinner' : 'image'}
            disabled={!!isUploadingImage}
          />
          <ButtonMy
            onPress={sendVideo}
            icon={isUploadingVideo ? 'spinner' : 'film'}
            disabled={!!isUploadingVideo}
          />
          <ButtonMy
            onPress={sendDocument}
            icon={isUploadingDocument ? 'spinner' : 'file'}
            disabled={!!isUploadingDocument}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            gap: 10,
            justifyContent: 'center',
          }}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
            placeholderTextColor={'#131313'}
          />
          <ButtonMy onPress={sendMessage} icon={'arrow-right'} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  myMessage: {
    backgroundColor: '#e1ffc7',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: 'lightgrey',
    alignSelf: 'flex-start',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    // marginBottom: 12,
    paddingHorizontal: 8,
    width: '60%',
    flex: 1,
    borderRadius: 10,
    color: 'black',
  },
  timestamp: {
    fontSize: 12,
    color: 'grey',
    textAlign: 'right',
    marginTop: 5,
  },
  img: {
    width: 200,
    height: 200,
  },
});

export default DirectChat;
