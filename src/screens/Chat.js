import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { ref, onValue, push } from 'firebase/database';
import { database,auth } from '../../firebase/firebase';

const Chat = ({route}) => {

  const {groupId}= route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const messagesRef = ref(database, `groups/${groupId}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesArray = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
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
    }
  };

  return (
    <View style={styles.container}>
    <FlatList
      data={messages}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.message}>
          <Text style={{color:"black"}} >{item.email}: {item.text}</Text>
        </View>
      )}
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
  )
}

export default Chat

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding:7,
    color:"black",
    marginBottom:10
  },
  message: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
})