import { Dimensions } from "react-native";

const {width:deviceWidth,height:deviceHeight} = Dimensions.get('window');


export const wp = percentage=>{
    const width= deviceWidth;
    return(percentage*width)/100;
}

export const hp = percentage=>{
    const height= deviceHeight;
    return(percentage*height)/100;
}

export  const getColumnsCount = ()=>{
    if(deviceWidth>=1024){
        return 4;
    }else if(deviceWidth=>768){
        return 3;
    }else{
        return 2;
    }

   
} 

export const getImageSize =(height,width)=>{
          if(width>height){
            //landscap
            return 250;
          }else if(width<height){
            //portrait
            return 300;
          }else{
            return 200;
          }
}

export const capitalize = str=>{
  return str.replace(/\b\w/g, l =>l.toUpperCase())
}

