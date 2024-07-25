import {launchImageLibrary} from 'react-native-image-picker';
import {storage} from '../../firebase/firebase';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';

export const PickImage = callback => {
  launchImageLibrary({mediaType: 'photo', quality: 0.5}, response => {
    if (response.didCancel) {
      console.log('User cancelled media picker');
      callback(null);
    } else if (response.error) {
      console.log('Media picker error', response.error);
      callback(null);
    } else {
      const {uri, fileName, type} = response.assets[0];
      if (type.startsWith('image/')) {
        console.log('Picked an image');
      } else if (type.startsWith('video/')) {
        console.log('Picked a video');
      }
      callback({uri, fileName, type});
    }
  });
};

export const PickVideo = callback => {
  launchImageLibrary(
    {mediaType: 'video', quality: 0.5, videoQuality: 'medium'},
    response => {
      if (response.didCancel) {
        console.log('User cancelled media picker');
        callback(null);
      } else if (response.error) {
        console.log('Media picker error', response.error);
        callback(null);
      } else {
        const {uri, fileName, type} = response.assets[0];
        if (type.startsWith('image/')) {
          console.log('Picked an image');
        } else if (type.startsWith('video/')) {
          console.log('Picked a video');
        }
        callback({uri, fileName, type});
      }
    },
  );
};

export const uploadDocument = async document => {
  const storageRef = ref(storage, `documents/${document.name}`);
  const uploadTask = uploadBytesResumable(storageRef, document);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      snapshot => {
        // You can monitor the upload progress here if needed
      },
      error => {
        // Handle unsuccessful uploads
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          resolve(downloadURL);
        });
      },
    );
  });
};
