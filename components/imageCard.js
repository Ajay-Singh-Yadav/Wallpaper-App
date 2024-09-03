import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Image } from 'expo-image';
import React from 'react'
import { getImageSize, wp } from '../helper/common';
// import { hp, wp } from '../../helper/common';
import { theme }  from './../constants/theme'

const ImageCard = ({ item, index, columns, router}) => {

    const isLastRow = ()=>{

        return (index+1) % columns ===0;

    }

    const  getImageHeight=()=>{
        let {imageHeight: height, imageWidth:width} = item;
        return {height: getImageSize(height,width)};
    }
    return (
        <Pressable 
           onPress={()=>router.push({pathname:'home/image', params: {...item}})}
        style={[styles.imageWrapper,!isLastRow() && styles.spacing]}>
            <Image
                style={[styles.image, getImageHeight()]}
                source={ item?.webformatURL}
                transition={100}
            />
            {/* <Image style={styles.image} source={{ uri: item?.webformatURL }} /> */}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    image: {

        width: '100%',
        height: 300,

    },

    imageWrapper:{
         backgroundColor: theme.colors.grayBG,
         borderRadius:theme.radius.xl,
         borderCurve:'continuous',
         overflow:'hidden',
         marginBottom:wp(2),
    
    },

    spacing:{
        marginRight:wp(2)

    }
})

export default ImageCard