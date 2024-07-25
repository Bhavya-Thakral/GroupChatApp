import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const Language = () => {
  const options = [
    'English',
    'Hindi',
    'Gujarati',
    'Tamil',
    'Telugu',
    'Punjabi',
    'Urdu',
  ];

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        {options.map((option, index) => (
          <Pressable key={index} style={styles.press}>
            <View style={styles.insidePress}>
              <Text style={styles.text}>{option}</Text>
              {option === 'English' && (
                <Icon name="check" size={20} color="#185389" />
              )}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default Language;

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
