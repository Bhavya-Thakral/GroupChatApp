import {launchImageLibrary} from 'react-native-image-picker';

export const PickImage = (callback) => {
    launchImageLibrary({mediaType:'photo'},(response)=>{
        if(response.didCancel){
            console.log("User cancelled image picker");
        }
        else if(response.error){
            console.log("Image picker error",response.error);
        }
        else{
            const {uri , fileName , type} = response.assets[0];
            callback({uri,fileName,type});
        }
    });
};