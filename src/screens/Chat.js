// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
// import { ref, onValue, push } from 'firebase/database';
// import { database,auth } from '../../firebase/firebase';
// import Icon from 'react-native-vector-icons/AntDesign';

// const Chat = ({route}) => {

//   const { chatType} = route.params;
//   const { chatId:groupId } = route.params;
//   console.log("chatType",chatType);
//   console.log("groupId",groupId);

//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   console.log("messages",messages);

//   useEffect(() => {
//     const messagesRef = ref(database, `groups/${groupId}/messages`);
//     onValue(messagesRef, (snapshot) => {
//       const data = snapshot.val();
//       const messagesArray = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
//       setMessages(messagesArray);
//     });
//   }, [groupId]);

//   const sendMessage = async () => {
//     const user = auth.currentUser;
//     if (user && newMessage) {
//       const messagesRef = ref(database, `groups/${groupId}/messages`);
//       await push(messagesRef, {
//         text: newMessage,
//         createdAt: new Date().toISOString(),
//         userId: user.uid,
//         email: user.email,
//       });
//       setNewMessage('');
//     }
//   };

//   return (
//     <View style={styles.container}>
//     <FlatList
//     //  ref={flatListRef}
//       data={messages}
//       keyExtractor={item => item.id}
//       renderItem={({ item }) => (
//         <View style={item.userId === auth.currentUser.uid ? styles.myMessage :styles.message}>
//           <View style={item.userId === auth.currentUser.uid ? styles.myProfile : styles.profile}>
//           <Icon name="user" size={20} color={'grey'}/>
//           </View>
//           <View style={styles.msg} >
//           <Text style={{color:"black"}}>{item.email}</Text>
//           <Text style={{color:"black",fontSize:18}}> {item.text}</Text>
//           </View>
//         </View>
//       )}
//     />
//     <TextInput
//       style={styles.input}
//       placeholder="Type a message..."
//       value={newMessage}
//       onChangeText={setNewMessage}
//       placeholderTextColor={'#1313'}
//     />
//     <Button title="Send" onPress={sendMessage} />
//   </View>
//   )
// }

// export default Chat

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     // marginHorizontal:10
//   },
//   input: {
//     borderWidth: 1,
//     borderRadius: 5,
//     width: '100%',
//     padding:7,
//     color:"black",
//     marginBottom:10
//   },
//   message: {
//     padding: 10,
//     flexDirection: 'row',
//   },
//   myMessage:{
//     flexDirection:'row-reverse',
//     alignSelf:'flex-end'
//   },
//   msg:{
//     backgroundColor:"lightgrey",
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     marginRight: 10,
//     padding:5,
//     maxWidth: '80%',
//   },
//   profile:{
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: 'lightblue',
//     marginRight: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf:'flex-end'
//   },
//   myProfile:{
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: 'lightpink',
//     marginRight: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf:'flex-end'
//   }
// })



import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { ref, onValue, push } from 'firebase/database';
import { database, auth } from '../../firebase/firebase';
import Icon from 'react-native-vector-icons/AntDesign';
import { format, isToday, isYesterday } from 'date-fns';

const Chat = ({ route }) => {
  const { chatType, chatId: groupId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    const messagesRef = ref(database, `groups/${groupId}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesArray = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse() : [];
      setMessages(messagesArray);
    });
  }, [groupId]);

  const sendMessage = async () => {
    const user = auth.currentUser;
    if (user && newMessage) {
      const messagesRef = ref(database, `groups/${groupId}/messages`);
      await push(messagesRef, {
        text: newMessage,
        createdAt: new Date().toISOString(),
        userId: user.uid,
        email: user.email,
      });
      setNewMessage('');
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      if (isToday(date)) {
        return `Today ${format(date, 'HH:mm')}`;
      } else if (isYesterday(date)) {
        return `Yesterday ${format(date, 'HH:mm')}`;
      } else {
        return format(date, 'dd/MM/yyyy HH:mm');
      }
    } catch (error) {
      console.error('Invalid timestamp:', timestamp);
      return '';
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={item.userId === auth.currentUser.uid ? styles.myMessage : styles.message}>
            <View style={item.userId === auth.currentUser.uid ? styles.myProfile : styles.profile}>
              <Icon name="user" size={20} color={'grey'} />
            </View>
            <View style={styles.msg}>
              <Text style={{ color: "black" }}>{item.email}</Text>
              <Text style={{ color: "black", fontSize: 18 }}> {item.text}</Text>
              <Text style={styles.timestamp}>{formatTimestamp(item.createdAt)}</Text>
            </View>
          </View>
        )}
        inverted
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={newMessage}
        onChangeText={setNewMessage}
        placeholderTextColor={'#1313'}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 7,
    color: "black",
    marginBottom: 10
  },
  message: {
    padding: 10,
    flexDirection: 'row',
  },
  myMessage: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end'
  },
  msg: {
    backgroundColor: "lightgrey",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
    padding: 5,
    maxWidth: '80%',
  },
  profile: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'lightblue',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end'
  },
  myProfile: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'lightpink',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end'
  },
  timestamp: {
    fontSize: 12,
    color: 'grey',
    textAlign: 'right',
    marginTop: 5,
  }
});
