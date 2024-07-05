import storage from '@react-native-firebase/storage';

export const uploadImage = async (image) => {
  if (!image) {
    throw new Error('Image is required');
  }
  const { uri, fileName, type } = image;
  console.log("uri",uri);   
    console.log("fileName",fileName);
    console.log("type",type);
 console.log("fileName", fileName);
console.log("type", type);

if (!uri || !fileName || !type) {
  throw new Error('Image must have uri, fileName, and type');
}

const storageRef = storage().ref(`images/${fileName}`);

try {
  await storageRef.putFile(uri); 
  console.log('Upload successful');
  const downloadURL = await storageRef.getDownloadURL();
  console.log('Download URL:', downloadURL);
  return downloadURL;
} catch (error) {
  console.error('Upload error:', error);
  throw error; 
}
}


export const uploadVideo = async (video) => {
  if (!video) {
    throw new Error('Video is required');
  }
  const { uri, fileName, type } = video;
  console.log("uri",uri);   
    console.log("fileName",fileName);
    console.log("type",type);
 console.log("fileName", fileName);
console.log("type", type);

if (!uri || !fileName || !type) {
  throw new Error('Video must have uri, fileName, and type');
}

const storageRef = storage().ref(`videos/${fileName}`);

try {
  await storageRef.putFile(uri); 
  console.log('Upload successful');
  const downloadURL = await storageRef.getDownloadURL();
  console.log('Download URL:', downloadURL);
  return downloadURL;
} catch (error) {
  console.error('Upload error:', error);
  throw error; 
}
}