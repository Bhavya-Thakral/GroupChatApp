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
  Button,
  Modal,
} from 'react-native';
import {auth, database} from '../../firebase/firebase';
import {ref, onValue, push, get} from 'firebase/database';
import {format, isToday, isYesterday, set} from 'date-fns';
import {PickImage, PickVideo, uploadDocument} from '../extras/PickImage';
import {uploadImage, uploadVideo} from '../extras/StoreToFirebase';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import {getCurrentLocation} from '../extras/LocationHelper';
import MapView, {Marker} from 'react-native-maps';
import ButtonMy from '../extras/ButtonMy';
import {useChat} from '../Context/Context';
import DocumentPicker from 'react-native-document-picker';
import {ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';

const DirectChat = ({route, navigation}) => {
  const {chatType, userId: chatId, chatName: chatName} = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingLocation, setIsUploadingLocation] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userID, setUserID] = useState('');
  const [userName, setUserName] = useState('');
  const [invitees, setInvitees] = useState([chatId]);
  console.log('invitees', invitees);
  console.log('userID', userID);
  console.log('chatId', chatId);
  console.log('messages', messages);
  console.log('modal', isModalVisible);

  const shareOptions = [
    {
      id: 1,
      label: 'Document',
      icon: '📄',
      onPress: () => Alert.alert('Document selected'),
    },
    {id: 2, label: 'Camera', icon: '📷', onPress: () => console.log('camera')},
    {
      id: 3,
      label: 'Gallery',
      icon: '🖼️',
      onPress: () => console.log('Gallery'),
    },
    {
      id: 4,
      label: 'Audio',
      icon: '🎵',
      onPress: () => Alert.alert('Audio selected'),
    },
    {id: 5, label: 'Location', icon: '📍', onPress: sendLocationMessage},
    {
      id: 6,
      label: 'Contact',
      icon: '📇',
      onPress: () => Alert.alert('Contact selected'),
    },
  ];

  const getUserInfo = async () => {
    try {
      const userID = await AsyncStorage.getItem('userID');
      const userName = await AsyncStorage.getItem('userName');
      if (!userID || !userName) {
        return undefined;
      } else {
        return {userID, userName};
      }
    } catch (e) {
      return undefined;
    }
  };

  useEffect(() => {
    getUserInfo().then(info => {
      if (info) {
        setUserID(info.userID);
        setUserName(info.userName);
      }
    });
  }, []);

  useEffect(() => {
    const updateInvitees = async chatId => {
      if (chatType === 'groups') {
        console.log('Fetching group members...');
        const groupMembersRef = ref(database, `groups/${chatId}/members`);
        const snapshot = await get(groupMembersRef);

        if (snapshot.exists()) {
          const members = snapshot.val();
          console.log('Group members:', members);

          const inviteeList = Object.keys(members).map(memberId => ({
            userID: memberId,
            userName: members[memberId].name || 'Unknown',
          }));

          console.log('Invitee list:', inviteeList);
          setInvitees(inviteeList);
        } else {
          console.log('No group members found.');
          setInvitees([]);
        }
      } else {
        // For non-group chats, set invitees with a single object
        setInvitees([{userID: chatId, userName: chatName}]);
      }
    };

    if (chatId) {
      updateInvitees(chatId);
    }
  }, [chatId, chatType]);

  const {currentChat} = useChat();
  const currentUserId = auth.currentUser.uid;

  // const chatId = chatType === 'group' ? groupId : currentUserId < userId ? `${currentUserId}_${userId}` : `${userId}_${currentUserId}`;

  const flatListRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: chatName,
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            marginRight: 10,
            gap: 5,
            marginBottom: 10,
          }}>
          <ZegoSendCallInvitationButton
            invitees={invitees.map(invitee => ({
              userID: invitee.userID,
              userName: invitee.userName,
            }))}
            isVideoCall={true}
            resourceID={'Group_Chat'}
          />
          <ZegoSendCallInvitationButton
            invitees={invitees.map(invitee => ({
              userID: invitee.userID,
              userName: invitee.userName,
            }))}
            isVideoCall={false}
            resourceID={'Group_Chat'}
            onPressed={() => {
              console.log('voice call pressed');
              console.log('invitees at calling', invitees);
            }}
          />
        </View>
      ),
      headerLeft: () => {
        return currentChat?.photoURL ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 10,
              marginBottom: 10,
            }}>
            <Icon1
              name="arrow-left"
              size={20}
              color={'#fff'}
              onPress={() => navigation.goBack()}
            />
            <Image
              source={{uri: currentChat?.photoURL}}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginLeft: 10,
                backgroundColor: 'lightgrey',
                borderWidth: 1,
                borderColor: '#fff',
              }}
            />
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 10,
            }}>
            <Icon1
              name="arrow-left"
              size={20}
              color={'#fff'}
              onPress={() => navigation.goBack()}
            />
            <View
              style={{
                width: 50,
                height: 50,
                borderWidth: 1,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 10,
                borderColor: '#fff',
              }}>
              <Icon name="user" size={20} color={'#fff'} />
            </View>
          </View>
        );
      },
    });
  }, [navigation, chatName, invitees]);

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

  const renderItem = ({item}) => {
    return (
      <View style={styles.msgContainer}>
        <View
          style={[
            item.senderId === currentUserId || item.userId === currentUserId
              ? {
                  flexDirection: 'row-reverse',
                  gap: 5,
                }
              : {
                  flexDirection: 'row',
                },
          ]}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg',
            }}
            style={styles.img}
          />
          <View style={{flexDirection: 'column'}}>
            <View
              style={[
                item.senderId === currentUserId || item.userId === currentUserId
                  ? styles.myMessage
                  : styles.theirMessage,
              ]}>
              {item.senderId !== currentUserId &&
                item.userId !== currentUserId &&
                chatType === 'groups' && (
                  <Text style={{color: 'black'}}>
                    {item.name || item.email}
                  </Text>
                )}
              {item.text ? (
                <Text
                  style={[
                    {fontSize: 18},
                    item.senderId === currentUserId ||
                    item.userId === currentUserId
                      ? {color: 'white'}
                      : {color: 'black'},
                  ]}>
                  {item.text}
                </Text>
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
                  <Text
                    style={{color: 'blue', textDecorationLine: 'underline'}}>
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
            </View>
            <Text
              style={[
                styles.timestamp,
                item.senderId === currentUserId || item.userId === currentUserId
                  ? {textAlign: 'right'}
                  : {textAlign: 'left'},
              ]}>
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  function openModal() {
    console.log('open modal');
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
  }

  function openEmoji() {
    console.log('open emoji');
  }

  function handleVoice() {
    console.log('voice');
  }

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <FlatList
            data={messages}
            showsVerticalScrollIndicator={false}
            ref={flatListRef}
            renderItem={renderItem}
            inverted={true}
            keyExtractor={item => item.id}
          />
        </View>
        <View style={styles.sendContainer}>
          <View style={styles.outerInput}>
            <Icon
              name="paperclip"
              color={'#72787F'}
              size={20}
              onPress={openModal}
            />
            <Icon1
              name="smile-o"
              color={'#72787F'}
              size={20}
              onPress={openEmoji}
            />
            <TextInput
              placeholder="Message..."
              style={{flex: 1}}
              onChangeText={setText}
              value={text}
            />
            <Icon1
              name="microphone"
              color={'#72787F'}
              size={20}
              onPress={handleVoice}
            />
          </View>
          <ButtonMy
            icon="paper-plane"
            onPress={() => {
              sendMessage();
              console.log('pressed');
            }}
          />
        </View>
      </View>
    </View>
  );
};

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
  searchContainer: {
    padding: 10,
    flex: 1,
  },
  msgContainer: {
    flex: 1,
  },
  msg: {
    borderRadius: 8,
    backgroundColor: '#185389',
    alignItems: 'center',
    justifyContent: 'center',
  },
  myMessage: {
    backgroundColor: '#185389',
    borderRadius: 8,
    borderBottomRightRadius: 0,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  theirMessage: {
    borderRadius: 8,
    paddingHorizontal: 8,
    borderBottomLeftRadius: 0,
    paddingVertical: 10,
    pabackgroundColor: '#9EA4AA33',
  },
  timestamp: {
    fontSize: 12,
    color: '#72787F',
    textAlign: 'right',
    marginTop: 5,
    marginBottom: 10,
  },

  msgTxt: {
    fontSize: 14,
    color: 'white',
    fontWeight: '400',
    alignSelf: 'center',
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#D0E3FF',
  },
  sendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  outerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    borderWidth: 1,
    flex: 1,
    borderColor: '#C9CDD2',
    borderRadius: 8,
    gap: 7,
    paddingHorizontal: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  option: {
    alignItems: 'center',
  },
  optionText: {
    marginTop: 5,
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DirectChat;
