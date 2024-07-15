import {Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';

const ButtonMy = ({onPress, icon , disabled}) => {

    function handlePress(){
        if(disabled){
            return;
        }
        onPress();
    }


  return (
    <Pressable onPress={handlePress} style={styles.press} >
      <Icon name={icon} size={18} color={'blue'} style={styles.icon} />
    </Pressable>
  );
};

export default ButtonMy;

const styles = StyleSheet.create({
    press:{
        padding: 5,
        borderRadius: 50,
        backgroundColor: 'lightgrey',
        // marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon:{
        margin: 5,
    }
});
