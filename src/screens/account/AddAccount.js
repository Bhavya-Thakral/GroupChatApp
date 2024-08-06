import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import MainButton from '../../extras/MainButton';
import { useNavigation } from '@react-navigation/native';

const AddAccount = () => {

  const navigation = useNavigation();

  const [mobile, setMobile] = useState('');

  const pressHandler = () => {
    navigation.navigate('OtpVerification', {mobile});
    console.log('handler');
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <Text style={styles.head}>
          ChatApp will need to verify your phone number.
        </Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputHeading}>Enter your phone number</Text>
          <TextInput
            placeholder={'Enter Here'}
            style={styles.input}
            placeholderTextColor={'#9EA4AA'}
            onChangeText={setMobile}
            keyboardType='number-pad'
            maxLength={10}
          />
        </View>
        <MainButton onPress={pressHandler}>Next</MainButton>
      </View>
    </View>
  );
};

export default AddAccount;

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
    alignItems: 'center',
  },
  head: {
    color: '#9EA4AA',
    fontSize: 14,
    fontWeight: '400',
  },
  inputContainer: {
    alignItems: 'flex-start',
    width: '90%',
    flex: 0.95,
    gap: 5,
  },
  inputHeading: {
    color: '#273567',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#C9CDD2',
    borderRadius: 8,
    color: '#26282B',
    fontSize: 14,
    fontWeight: '400',
    paddingLeft: 10,
  },
});
