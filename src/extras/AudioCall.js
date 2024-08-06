import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
  ONE_ON_ONE_VOICE_CALL_CONFIG,
  ZegoSendCallInvitationButton,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

const AudioCall = props => {
  const {chatId: userID, chatName: userName} = props.route.params;

  // useEffect(() => {
  //   <ZegoSendCallInvitationButton
  //     invitees={[{userID: userID, userName: userName}]}
  //     isVideoCall={false}
  //     resourceID={'Group_Chat'} // Please fill in the resource ID name that has been configured in the ZEGOCLOUD's console here.
  //   />;
  // }, []);

  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltCall
        appID={97492}
        appSign={
          'e930226544e43d2a3b39fc6c0721dfcf7f1f26c6b5f7a258a223f57ba5220e67'
        }
        userID={userID} // userID can be something like a phone number or the user id on your own user system.
        userName={userName}
        callID={'nwduhd'} // callID can be any unique string.
        config={{
          // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
          //   ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
          ...ONE_ON_ONE_VOICE_CALL_CONFIG,
          onCallEnd: (callID, reason, duration) => {
            props.navigation.goBack();
          },
        }}
      />
    </View>
  );
};

export default AudioCall;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
});
