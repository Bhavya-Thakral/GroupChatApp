// screens/CreateGroupScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Pressable, Text } from 'react-native';
import { database, auth } from '../../firebase/firebase';
import { ref, push, update } from 'firebase/database';

const CreateGroup = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');

  const handleCreateGroup = async () => {
    if (groupName) {
      const user = auth.currentUser;
      const groupsRef = ref(database, 'groups/');
      const newGroupRef = await push(groupsRef, {
        name: groupName,
        members: {}
      });

      if (user) {
        const groupMembersRef = ref(database, `groups/${newGroupRef.key}/members`);
        await update(groupMembersRef, { [user.uid]: true });
      }

      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
        placeholderTextColor={'#1313'}
      />

      <Pressable style={({pressed})=> pressed && styles.pressed} onPress={handleCreateGroup} >
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
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding:7,
    color:"black",
    marginBottom:10
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
  
});

export default CreateGroup;
