import { Pressable, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import React, { useLayoutEffect } from 'react'

const OneList = ({navigation}) => {
    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => {
            return (
              <View style={{flexDirection: 'row'}}>
                <Pressable
                //   onPress={createHandler}
                  style={({pressed}) => {
                    pressed && styles.press;
                  }}>
                  <Icon
                    name="addusergroup"
                    size={20}
                    color={'#131313'}
                    style={{marginRight: 20}}
                  />
                </Pressable>
                <Pressable
                //   onPress={logoutHandler}
                  style={({pressed}) => {
                    pressed && styles.press;
                  }}>
                  <Icon
                    name="logout"
                    size={20}
                    color={'#131313'}
                    style={{marginRight: 20}}
                  />
                </Pressable>
              </View>
            );
          },
        });
      }, []);
    
  return (
    <View>
      <Text style={{color:"black"}} >OneList</Text>
    </View>
  )
}

export default OneList

const styles = StyleSheet.create({})