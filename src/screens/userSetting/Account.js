import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Account = () => {
  const options = [
    {
      icon: require('../../../public/assets/images/changePhoneNumber.png'),
      title: 'Change Number',
    },
    {
      icon: require('../../../public/assets/images/twoStepVerification.png'),
      title: 'Two-step verification',
    },
    {
      icon: require('../../../public/assets/images/requestAccountInfo.png'),
      title: 'Request account info',
    },
    {
      icon: require('../../../public/assets/images/addAccount.png'),
      title: 'Add account',
    },
    {
      icon: require('../../../public/assets/images/deleteAccount.png'),
      title: 'Delete account',
    },
  ];

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        {options.map((option, index) => (
          <Pressable key={index} style={styles.press}>
            <View style={styles.insidePress}>
              <Image source={option.icon} style={{width: 30, height: 30}} />
              <Text style={styles.text}>{option.title}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#185389',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 20,
    paddingTop: 20,
  },
  press: {
    borderBottomWidth: 1,
    marginHorizontal: 20,
    borderBottomColor: '#E8EBED',
  },
  insidePress: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    margin: 10,
  },
  text: {
    color: '#26282B',
    fontSize: 14,
    fontWeight: '600',
  },
});
