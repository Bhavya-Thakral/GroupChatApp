import {launchImageLibrary} from 'react-native-image-picker';

export const PickImage = (callback) => {
    launchImageLibrary({mediaType:'mixed',quality:0.5,videoQuality:'medium'},(response)=>{
        if(response.didCancel){
            console.log("User cancelled media picker");
        }
        else if(response.error){
            console.log("Media picker error",response.error);
        }
        else{
            const {uri , fileName , type} = response.assets[0];
            if (type.startsWith('image/')) {
                console.log("Picked an image");
            } else if (type.startsWith('video/')) {
                console.log("Picked a video");
            }
            callback({uri,fileName,type});
        }
    });
};