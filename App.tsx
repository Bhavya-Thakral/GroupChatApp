import {Pressable, StatusBar, StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './src/screens/signin/Login';
import Register from './src/screens/signup/Register';
import Chat from './src/screens/Chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatList from './src/screens/ChatList';
import CreateGroup from './src/screens/CreateGroup';
import {auth} from './firebase/firebase';
import PhoneSignIn from './src/screens/signup/PhoneSignIn';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './src/screens/Home';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/AntDesign';
import DirectChat from './src/screens/DirectChat';
import Settings from './src/screens/Settings';
import Search from './src/screens/Search';
import CallHistory from './src/screens/CallHistory';
import Account from './src/screens/userSetting/Account';
import Help from './src/screens/userSetting/Help';
import Language from './src/screens/userSetting/Language';
import Privacy from './src/screens/userSetting/Privacy';
import Profile from './src/screens/userSetting/Profile';

import {ChatProvider} from './src/Context/Context';
import AudioCall from './src/extras/AudioCall';
import {
  ZegoCallInvitationDialog,
  ZegoUIKitPrebuiltCallWaitingScreen,
  ZegoUIKitPrebuiltCallInCallScreen,
  ZegoUIKitPrebuiltCallFloatingMinimizedView,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import Otp from './src/screens/signin/Otp';
import changeNumber from './src/screens/account/ChangeNumber';
import twoStepVerification from './src/screens/account/TwoStepVerification';
import requestAccountInfo from './src/screens/account/RequestAccountInfo';
import addAccount from './src/screens/account/AddAccount';
import deleteAccount from './src/screens/account/DeleteAccount';
import ChangeNumber from './src/screens/account/ChangeNumber';
import TwoStepVerification from './src/screens/account/TwoStepVerification';
import RequestAccountInfo from './src/screens/account/RequestAccountInfo';
import AddAccount from './src/screens/account/AddAccount';
import DeleteAccount from './src/screens/account/DeleteAccount';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setInitialRoute('MyTabs');
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
      <Tab.Navigator
        initialRouteName="OneList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#185389',
          },
          headerTintColor: '#fff',
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({size, color}) => {
              return <Icon name="home" size={size} color={color} />;
            },
            tabBarLabel: 'Chats',
            title: 'Home',
          }}
        />
        <Tab.Screen
          name="ChatList"
          component={ChatList}
          options={{
            tabBarIcon: ({size, color}) => {
              return <Icon name="comments" size={size} color={color} />;
            },
            title: 'Groups',
            tabBarLabel: 'Groups',
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarIcon: ({size, color}) => {
              return <Icon name="search" size={size} color={color} />;
            },
            title: 'Search',
            tabBarLabel: 'Search',
          }}
        />
        <Tab.Screen
          name="Calls"
          component={CallHistory}
          options={{
            tabBarIcon: ({size, color}) => {
              return <Icon name="phone" size={size} color={color} />;
            },
            title: 'Calls',
            tabBarLabel: 'Calls',
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarIcon: ({size, color}) => {
              return <Icon name="cog" size={size} color={color} />;
            },
            title: 'Settings',
            tabBarLabel: 'Settings',
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <ChatProvider>
      <NavigationContainer
        initialState={{
          routes: [{name: initialRoute}],
        }}>
        <StatusBar
          barStyle={'light-content'}
          translucent={true}
          backgroundColor={'transparent'}
        />
        <ZegoCallInvitationDialog />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#185389',
            },
            headerTintColor: '#fff',
          }}>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Otp"
            component={Otp}
            options={{
              headerShown: false,
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
              headerShown: false,
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
          <Stack.Screen
            name="DirectChat"
            component={DirectChat}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="AudioCall"
            component={AudioCall}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            options={{headerShown: false}}
            // DO NOT change the name
            name="ZegoUIKitPrebuiltCallWaitingScreen"
            component={ZegoUIKitPrebuiltCallWaitingScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            // DO NOT change the name
            name="ZegoUIKitPrebuiltCallInCallScreen"
            component={ZegoUIKitPrebuiltCallInCallScreen}
          />
          <Stack.Screen
            name="Account"
            component={Account}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="Privacy"
            component={Privacy}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="Help"
            component={Help}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="Language"
            component={Language}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="ChangeNumber"
            component={ChangeNumber}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="TwoStepVerification"
            component={TwoStepVerification}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="RequestAccountInfo"
            component={RequestAccountInfo}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="AddAccount"
            component={AddAccount}
            options={{
              headerShown: true,
            }}
          />
        </Stack.Navigator>
        <ZegoUIKitPrebuiltCallFloatingMinimizedView />
      </NavigationContainer>
    </ChatProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
