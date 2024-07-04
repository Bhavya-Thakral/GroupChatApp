import storage from '@react-native-firebase/storage';

export const uploadImage = async (image) => {
  // Check if the image object is provided
  if (!image) {
    throw new Error('Image is required');
  }

  // Destructure necessary properties from the image object
  const { uri, fileName, type } = image;

  console.log("uri",uri);   
    console.log("fileName",fileName);
    console.log("type",type);

 console.log("fileName", fileName);
console.log("type", type);

// Check if the required properties are present
if (!uri || !fileName || !type) {
  throw new Error('Image must have uri, fileName, and type');
}

// Reference to the storage location
const storageRef = storage().ref(`images/${fileName}`);

try {
  // Start the file upload
  await storageRef.putFile(uri); // Assuming putFile returns a promise and uploads the file

  console.log('Upload successful');

  // Get the download URL only after confirming the upload is successful
  const downloadURL = await storageRef.getDownloadURL();
  console.log('Download URL:', downloadURL);
  return downloadURL;
} catch (error) {
  console.error('Upload error:', error);
  // Handle the error appropriately
  throw error; // Rethrow or handle the error as needed
}
}