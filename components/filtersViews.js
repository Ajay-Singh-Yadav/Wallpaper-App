import { View, Text, StyleSheet, Pressable } from 'react-native'
import { hp, wp } from '../helper/common'
import { theme } from '../constants/theme'
import { data } from '../constants/data'
import { capitalize } from 'lodash'


export const SectionView = ({ content, title }) => {
    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionContainer}>{title}</Text>
            <View>
                {content}
            </View>

        </View>
    )
}


export const CommonFilterRow = ({ data, filterName, filters, setFilters }) => {

    const onSelect = (item) =>{
        setFilters({...filters, [filterName]:item});
    }

    return (
        <View style={styles.flexRowWrap}>
            {
                    data && data.map((item, index) => {

                        let isActive =  filters && filters[filterName] ==item;
                        let backgroundColor = isActive? theme.colors.neutral(0.7): 'white';
                        let color = isActive?'white':theme.colors.neutral(0.7);
                        return (
                            <Pressable
                                 onPress={()=>onSelect(item)}
                                key={item}
                                style={[styles.outlinedButton, {backgroundColor}]}
                            >
                                <Text style={[styles.outlinedButtonText ,{color}]}>{capitalize(item)}</Text>
                            </Pressable>
                        )
                    })
                
            }
        </View>
    )
}


export const ColorFilterRow = ({ data, filterName, filters, setFilters }) => {

    const onSelect = (item) =>{
        setFilters({...filters, [filterName]:item});
    }

    return (
        <View style={styles.flexRowWrap}>
            {
                    data && data.map((item, index) => {

                        let isActive =  filters && filters[filterName] ==item;
                         let borderColor = isActive? theme.colors.neutral(0.4):'white';

                        return (
                            <Pressable
                                 onPress={()=>onSelect(item)}
                                key={item}
                               
                            >
                                <View style={[styles.colorWrapper,{borderColor}]}>
                                    <View style={[styles.color,{backgroundColor:item}]} />
                                </View>
                            </Pressable>
                        )
                    })
                
            }
        </View>
    )
}

const styles = StyleSheet.create({

    sectionContainer: {
        gap: 8,

    },
    sectionTitle: {
        fontSize: hp(2.4),
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.neutral(0.8),

    },

    flexRowWrap:{
        gap:10,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    outlinedButton: {
        padding: 8,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        borderRadius: theme.radius.xs,
        borderCurve: 'continuous'
    },

    color:{
        height:30,
        width:40,
        borderRadius:theme.radius.sm-3,
        borderCurve:'continuous',
    }, 
    colorWrapper:{
        padding:3,
        borderRadius:theme.radius.sm,
        borderWidth:2,
        borderCurve:'continuous',

    }


})

