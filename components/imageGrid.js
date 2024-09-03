import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from './imageCard';
import { getColumnsCount, wp } from './../helper/common';

const ImagGrid = ({images, router}) => {
    const columns = getColumnsCount();
    return (
        <View style={styles.container}>
            <MasonryFlashList
                data={images}
               
                initialNumToRender={1000}
                contentContainerStyle={styles.listContainerStyle}
                numColumns={columns}
                renderItem={({ item, index }) => <ImageCard router={router} item={item} columns={columns} index={index}/>}
                estimatedItemSize={200}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        minHeight:3,
        width:wp(100)
       
    },
    listContainerStyle:{
         paddingHorizontal:wp(4)
    }
})

export default ImagGrid