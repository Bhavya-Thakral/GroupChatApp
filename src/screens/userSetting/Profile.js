import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/FontAwesome5';

const Profile = () => {
  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <Pressable style={styles.press}>
          <View style={styles.insidePress}>
            <View style={{position: 'relative'}}>
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg',
                }}
                style={styles.img}
              />
              <View style={styles.camera}>
                <Icon1 name="camera" size={26} color={'#fff'} />
              </View>
            </View>
          </View>
        </Pressable>
        <View style={styles.border}>
          <View style={styles.content}>
            <Icon1 name="user" color={'#185389'} size={26} />
            <View style={{flex: 1}}>
              <Text style={styles.head}>Name</Text>
              <Text style={styles.text}>Bhavya Thakral</Text>
            </View>
            <Icon1 name="pen" size={20} color={'#185389'} style={styles.icon} />
          </View>
        </View>
        <View style={styles.border}>
          <View style={styles.content}>
            <Icon name="mail" color={'#185389'} size={26} />
            <View style={{flex: 1}}>
              <Text style={styles.head}>Email</Text>
              <Text style={styles.text}>Bhavya@gmail.com</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;

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
    marginHorizontal: 20,
  },
  insidePress: {
    gap: 10,
    alignItems: 'center',
    margin: 10,
  },
  head: {
    color: '#9EA4AA',
    fontSize: 12,
    fontWeight: '500',
  },
  text: {
    color: '#26282B',
    fontSize: 14,
    fontWeight: '600',
  },
  img: {
    height: 200,
    width: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#185389',
  },
  camera: {
    position: 'absolute',
    width: 50,
    height: 50,
    bottom: 0,
    right: 15,
    backgroundColor: '#185389',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginHorizontal: 20,
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBED',
  },
});
