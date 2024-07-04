import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Text,
  Image,
  Alert,
} from 'react-native';
import {auth, database} from '../../firebase/firebase';
import {ref, onValue, push} from 'firebase/database';
import {format, isToday, isYesterday} from 'date-fns';
import {PickImage} from './PickImage';
import {uploadImage} from './StoreToFirebase';

const DirectChat = ({route}) => {
  const {userId} = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  console.log('messages', messages);

  const currentUserId = auth.currentUser.uid;
  const chatId =
    currentUserId < userId
      ? `${currentUserId}_${userId}`
      : `${userId}_${currentUserId}`;
  const flatListRef = useRef(null);

  useEffect(() => {
    const messagesRef = ref(database, `directMessages/${chatId}/messages`);
    onValue(messagesRef, snapshot => {
      const data = snapshot.val();
      const messagesArray = [];
      if (data) {
        Object.keys(data).forEach(key => {
          messagesArray.push({id: key, ...data[key]});
        });
      }
      setMessages(messagesArray.reverse()); // Reverse to display the latest message at the bottom
    });
  }, [chatId]);

  const sendMessage = async () => {
    if (text) {
      const messagesRef = ref(database, `directMessages/${chatId}/messages`);
      await push(messagesRef, {
        senderId: currentUserId,
        text,
        timestamp: Date.now(),
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
    const messagesRef = ref(database, `directMessages/${chatId}/messages`);
    await push(messagesRef, {
      img: imageUrl,
      timestamp: Date.now(),
      userId: auth.currentUser.uid,
      email: auth.currentUser.email,
    });
  };

  const sendImage = async () => {
    setIsUploading(true);
    PickImage(async image => {
      try {
        const imageUrl = await uploadImage(image);
        await saveImageUrl(chatId, imageUrl);
        Alert.alert('Image sent', 'Image sent successfully');
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setIsUploading(false);
      }
    });
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
              item.senderId === currentUserId
                ? styles.myMessage
                : styles.theirMessage,
            ]}>
            {item.text ? (
              <Text style={{fontSize: 18, color: 'black'}}>{item.text}</Text>
            ) : null}
            {item.img ? (
              <Image source={{uri: item.img}} style={styles.img} />
            ) : null}
            <Text style={styles.timestamp}>
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
        )}
        inverted={true}
      />
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type a message"
        placeholderTextColor={'#131313'}
      />
      <View style={{flexDirection: 'row'}}>
        <Button title="Send" onPress={sendMessage} />
        <Button
          title={isUploading ? ' Sending' : 'Send Image'}
          disabled={isUploading ? true : false}
          onPress={sendImage}
        />
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
    marginBottom: 12,
    paddingHorizontal: 8,
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
