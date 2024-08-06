import {ActivityIndicator, Pressable, StyleSheet, Text} from 'react-native';
import React from 'react';

const MainButton = ({children, onPress, loading}) => {
  console.log('loading', loading);
  return (
    <Pressable style={styles.btn} onPress={onPress}>
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.txt}>{children}</Text>
      )}
    </Pressable>
  );
};

export default MainButton;

const styles = StyleSheet.create({
  btn: {
    height: 40,
    backgroundColor: '#185389',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  txt: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
