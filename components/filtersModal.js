import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useMemo } from 'react'
import { BlurView } from 'expo-blur';

import {
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { capitalize, hp } from '../helper/common';
import { theme } from '../constants/theme';
import { SectionView, CommonFilterRow, ColorFilterRow } from './filtersViews';
import {data} from './../constants/data'

const FiltersModal
    = ({ modelRef , onClose, onApply, onReset, filters, setFilters}) => {


        // variables
        const snapPoints = useMemo(() => ['75%'], []);
        return (
            <BottomSheetModal
                ref={modelRef} 
                index={0}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                backdropComponent={CustomeBackdrop}
                //onChange={}
            >
                <BottomSheetView style={styles.contentContainer}>
                    <View style = {styles.content}>
                           <Text style={styles.filtersText}>Filters</Text>
                          {
                            Object.keys(sections).map((sectionName,index)=>{
                                let sectionView = sections[sectionName];
                                let sectionData = data.filters[sectionName];
                                let title = capitalize(sectionName);
                                return (
                                    <Animated.View 
                                    entering={FadeInDown.delay((index*100)+100).springify().damping(11)}
                                    
                                    key={sectionName}> 

                                    <SectionView 
                                     title={title}
                                     content={sectionView({
                                        data: sectionData,
                                        filters,
                                        setFilters,
                                        filterName:sectionName

                                     })}
                                    />
                                       
                                    </Animated.View>
                                )
                            })
                          }

                          {/* action */}
                          <Animated.View
                           entering={FadeInDown.delay(500).springify().damping(11)} 
                          
                          style={styles.buttons}>

                            <Pressable style={styles.resetButton}
                               onPress={onReset}>
                                <Text style={[styles.buttonText,{color:theme.colors.neutral(0.9)}]}>
                                    Reset</Text>
                               
                            </Pressable>

                            <Pressable style={styles.applyButton}
                               onPress={onApply}>
                                <Text style={[styles.buttonText,{color:theme.colors.white}]}>
                                    Appy</Text>
                               
                            </Pressable>
                          </Animated.View>

                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        )
    }

    const sections = {
         "order":(props)=><CommonFilterRow {...props} />,
         "orientation":(props)=> <CommonFilterRow {...props} />,
         "type":(props)=> <CommonFilterRow {...props} />,
         "colors":(props)=> <ColorFilterRow {...props} />,
    }


   
    
    const CustomeBackdrop = ({animatedIndex, style})=>{
         
        const containerAnimatedStyle = useAnimatedStyle(()=>{
            let opacity = interpolate(
                animatedIndex.value,
                [-1,0],
                [0,1],
                Extrapolation.CLAMP
            )
                  return {
                    opacity
                  }
        })

        const containerStyle = [
            StyleSheet.absoluteFill,
            style,
            styles.overlay,
            containerAnimatedStyle
        ]
        return (
            <Animated.View style={containerStyle}>
             {/* Blur View */}

             <BlurView style={StyleSheet.absoluteFill}
               tint="dark"
               intensity={25}s
             />
            </Animated.View>
        )

    }

    

        const styles = StyleSheet.create({
          
            contentContainer: {
              flex: 1,
              alignItems: 'center',
            },
            overlay:{
                backgroundColor:'rgba(0,0,0,0.5)'
            },

            content:{

                //flex:1,
               // width:'100%',
                gap:15,
                paddingHorizontal:20,
                paddingVertical:10,
                

            },
            filtersText:{

                fontSize:hp(4),
                fontWeight:theme.fontWeight.semibold,
                color: theme.colors.neutral(0.8),
                marginBottom:5

            },
            buttons:{
                flex:1,
                flexDirection:'row',
                gap:10,
                alignItems:'center'
            },
             applyButton:{
                flex:1,
                backgroundColor:theme.colors.neutral(0.8),
                padding:12,
                alignItems:'center',
                justifyContent:'center',
                borderRadius:theme.radius.md,
                borderCurve:'continuous'

             },
             resetButton:{
                flex:1,
                backgroundColor:theme.colors.neutral(0.03),
                padding:12,
                alignItems:'center',
                justifyContent:'center',
                borderRadius:theme.radius.md,
                borderCurve:'continuous',
                borderWidth:2,
                borderColor:theme.colors.grayBG

             },
             buttonText:{
                fontSize:hp(2.2)
             }

    })
export default FiltersModal
