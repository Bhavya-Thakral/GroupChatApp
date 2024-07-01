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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import OneList from './src/screens/OneList';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

  function MyTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="OneList"
          component={OneList}
          options={{
            tabBarIcon: ({size, color}) => {
              return <Icon name="comment" size={size} color={color} />;
            },
            tabBarLabel: 'Chats',
          }}
        />
        <Tab.Screen
          name="ChatList"
          component={ChatList}
          options={{
            tabBarIcon: ({size, color}) => {
              return <Icon name="comments" size={size} color={color} />;
            },
            tabBarLabel: 'Groups',
          }}
        />
      </Tab.Navigator>
    );
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
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="PhoneSignIn"
          component={PhoneSignIn}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen name="MyTabs" component={MyTabs} />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="CreateGroup"
          component={CreateGroup}
          options={{
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
