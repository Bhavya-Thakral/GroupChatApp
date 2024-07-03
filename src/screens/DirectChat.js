// // screens/SingleChatScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, TextInput, Button, FlatList, StyleSheet, Text } from 'react-native';
// import { auth, database } from '../../firebase/firebase';
// import { ref, onValue, push, update } from 'firebase/database';

// const DirectChat = ({ route }) => {
//   const { userId } = route.params;
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState('');

//   const currentUserId = auth.currentUser.uid;
//   const chatId = currentUserId < userId ? `${currentUserId}_${userId}` : `${userId}_${currentUserId}`;

//   useEffect(() => {
//     const messagesRef = ref(database, `directMessages/${chatId}`);
//     onValue(messagesRef, (snapshot) => {
//       const data = snapshot.val();
//       const messagesArray = [];
//       if (data) {
//         Object.keys(data).forEach((key) => {
//           messagesArray.push({ id: key, ...data[key] });
//         });
//       }
//       setMessages(messagesArray);
//     });
//   }, [chatId]);

//   const sendMessage = async () => {
//     if (text) {
//       const messagesRef = ref(database, `directMessages/${chatId}`);
//       await push(messagesRef, {
//         senderId: currentUserId,
//         text,
//         timestamp: Date.now()
//       });
//       setText('');
//     }
//   };
//   const convertTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleString().split('T'); // Default locale format
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => (
//           <View style={[styles.messageContainer, item.senderId === currentUserId ? styles.myMessage : styles.theirMessage]}>
//             <Text style={{fontSize:18}} >{item.text}</Text>
//             <Text style={{fontSize:12}} >{convertTimestamp(item.createdAt)}</Text>
//           </View>
//         )}
//         inverted={true}
//       />
//       <TextInput
//         style={styles.input}
//         value={text}
//         onChangeText={setText}
//         placeholder="Type a message"
//       />
//       <Button title="Send" onPress={sendMessage} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   messageContainer: {
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 5,
//   },
//   myMessage: {
//     backgroundColor: '#e1ffc7',
//     alignSelf: 'flex-end',
//   },
//   theirMessage: {
//     backgroundColor: 'lightgrey',
//     alignSelf: 'flex-start',
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//   },
// });

// export default DirectChat;


// screens/SingleChatScreen.js
import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, Text } from 'react-native';
import { auth, database } from '../../firebase/firebase';
import { ref, onValue, push } from 'firebase/database';
import { format, isToday, isYesterday } from 'date-fns';

const DirectChat = ({ route }) => {
  const { userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const currentUserId = auth.currentUser.uid;
  const chatId = currentUserId < userId ? `${currentUserId}_${userId}` : `${userId}_${currentUserId}`;
  const flatListRef = useRef(null);

  useEffect(() => {
    const messagesRef = ref(database, `directMessages/${chatId}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesArray = [];
      if (data) {
        Object.keys(data).forEach((key) => {
          messagesArray.push({ id: key, ...data[key] });
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
        timestamp: Date.now()
      });
      setText('');
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return `Today ${format(date, 'HH:mm')}`;
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'dd/MM/yyyy HH:mm');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
      showsVerticalScrollIndicator={false}
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.senderId === currentUserId ? styles.myMessage : styles.theirMessage]}>
            <Text style={{ fontSize: 18 }}>{item.text}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
          </View>
        )}
        inverted={true}
      />
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={sendMessage} />
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
});

export default DirectChat;

