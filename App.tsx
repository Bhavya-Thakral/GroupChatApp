import {Pressable, StatusBar, StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Chat from './src/screens/Chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatList from './src/screens/ChatList';
import CreateGroup from './src/screens/CreateGroup';
import {auth} from './firebase/firebase';
import PhoneSignIn from './src/screens/PhoneSignIn';

const Stack = createStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setInitialRoute('ChatList');
      } else {
        await AsyncStorage.removeItem('user');
        setInitialRoute('Login');
      }
      setInitializing(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  if (initializing) {
    // Optionally, show a splash screen while checking the user
    return null;
  }

  return (
    <NavigationContainer
      initialState={{
        routes: [{name: initialRoute}],
      }}>
      <StatusBar
        barStyle={'dark-content'}
        translucent={true}
        backgroundColor={'transparent'}
      />
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="PhoneSignIn" component={PhoneSignIn} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ChatList" component={ChatList} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
