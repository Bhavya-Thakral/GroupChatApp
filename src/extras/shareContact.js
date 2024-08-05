import Contacts from 'react-native-contacts';
import {PermissionsAndroid, Platform} from 'react-native';

async function requestContactPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Please accept bare mortal',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    return true;
  }
}
async function loadContacts() {
  const permission = await requestContactPermission();
  if (permission) {
    Contacts.getAll((err, contacts) => {
      if (err === 'denied') {
        // permission was denied
      } else {
        // contacts returned in array
        console.log(contacts);
      }
    });
  }
}
