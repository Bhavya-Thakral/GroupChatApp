import {Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';

const ButtonMy = ({onPress, icon, disabled}) => {
  function handlePress() {
    if (disabled) {
      return;
    }
    onPress();
  }

  return (
    <Pressable onPress={handlePress} style={styles.press}>
      <Icon name={icon} size={20} color={'#fff'} style={styles.icon} />
    </Pressable>
  );
};

export default ButtonMy;

const styles = StyleSheet.create({
  press: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#185389',
    // marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // icon: {
  //   margin: 5,
  // },
});
