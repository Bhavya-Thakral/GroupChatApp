import React from 'react';
import {Modal, View, Text, StyleSheet, Pressable} from 'react-native';

const Dialog = ({visible, onClose, title, message, onConfirm}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.buttonContainer}>
            <Pressable onPress={onConfirm} style={styles.btn}>
              <Text style={styles.text}>Yes</Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              style={[styles.btn, {backgroundColor: '#D0E3FF'}]}>
              <Text style={[styles.text, {color: '#273567'}]}>No</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    gap: 10,
  },
  btn: {
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#185389',
    flex: 1,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Dialog;
