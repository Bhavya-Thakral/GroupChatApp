import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import MainButton from './MainButton';
import {ImageBackground} from 'react-native';

const MainScreen = ({head, subHead, onPress, children, loading}) => {
  return (
    <ImageBackground
      source={require('../../public/assets/images/bg.png')}
      style={styles.main}>
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
        }}>
        <View style={{alignItems: 'center', justifyContent: 'center', gap: 10}}>
          <Text style={styles.head}>{head}</Text>
          <Text style={styles.subHead}>{subHead}</Text>
          {children}
          <MainButton onPress={onPress} loading={loading}>
            Continue
          </MainButton>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  head: {
    color: '#273567',
    fontSize: 20,
    fontWeight: '700',
    paddingTop: 180,
  },
  subHead: {
    color: '#9EA4AA',
    fontSize: 12,
    fontWeight: '400',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 8,
    color: 'black',
    height: 40,
    borderColor: '#C9CDD2',
  },
  content: {
    width: '90%',
    gap: 4,
  },
  contentHead: {
    color: '#273567',
    fontSize: 14,
    fontWeight: '600',
  },
});
