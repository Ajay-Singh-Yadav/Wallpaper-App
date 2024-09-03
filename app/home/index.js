import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { hp, wp } from '../../helper/common';
import { theme } from '../../constants/theme';
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import Categories from '../../components/categories';
import { apiCall } from '../../api/index';

import ImagGrid from '../../components/imageGrid';
import { debounce, keys } from 'lodash';
import FiltersModal from '../../components/filtersModal';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';



var page = 1;


const HomeScreen = () => {


    const { top } = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 10 : 30;
    const [search, setSearch] = useState('');
    const searchInputRef = useRef(null);
    const [filters, setFilters] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [images, setImages] = useState([]);
    const modelRef = useRef(null);
   
    const router  = useRouter();

    const scrollRef = useRef(null);

    const [isEndReached,setIsEndReached] = useState(false);




    useEffect(() => {
        fetchImages();
    }, []);


    const fetchImages = async (params = { page: 1 }, append = true) => {
        console.log('params ', params, append);
        let res = await apiCall(params);

        if (res.success && res?.data?.hits) {
            if (append)
                setImages([...images, ...res.data.hits])
            else
                setImages([...res.data.hits])

        }
    }


    const applyFilters = () => {
        if (filters) {
            page = 1;
            setImages([]);
            let params = {
                page,
                ...filters
            }
            if (activeCategory) params.category = activeCategory;
            if (search) params.q = search;
            fetchImages(params, false);

        }
        closeFiltersModal();
    }

    const clearThisFilter = (filterName) => {

        let filterz = { ...filters };
        delete filterz[filterName];
        setFilters({ ...filterz });
        page = 1;
        setImages([]);
        let params = {
            page,
            ...filterz
        }
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params, false);

    }


    const resetFilters = () => {
        if (filters) {
            page = 1;
            setFilters(null);
            setImages([]);
            let params = {
                page,

            }
            if (activeCategory) params.category = activeCategory;
            if (search) params.q = search;
            fetchImages(params, false);
        }
        closeFiltersModal();
    }

    const handleSearch = (text) => {
        setSearch(text);
        if (text.length > 2) {
            page = 1;
            //search form this text
            setImages([]);
            setActiveCategory(null);
            fetchImages({ page, q: text, ...filters }, false);
        }
        if (text == "") {
            //reset result
            searchInputRef?.current?.clear();
            page = 1;
            setImages([]);
            setActiveCategory(null);
            fetchImages({ page, ...filters }, false);

        }
    }

    const hanleChangeCategory = (cat) => {
        setActiveCategory(cat);
        clearSearch();
        setImages([]);
        page = 1;
        let params = {
            page,
            ...filters
        }
        if (cat) params.category = cat;
        fetchImages(params, false);
    }


    const clearSearch = () => {
        setSearch("");
        searchInputRef?.current?.clear();

    }

    const hanleScroll = (event)=>{

        const contentHeight = event.nativeEvent.contentSize.height;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        const scrolloffset = event.nativeEvent.contentOffset.y;
        const bottomposition = contentHeight - scrollViewHeight;
        if(scrolloffset>=bottomposition-1){

            if(!isEndReached){
                setIsEndReached(true);
                ++page;
                let params = {
                    page,
                    ...filters
                }
                  if(activeCategory) params.category = activeCategory;
                  if(search) params.q = search;
                  fetchImages (params);
            }
            
        }else if( isEndReached){
                  setIsEndReached(false);
        }

    }

    const hanleScrollUp = () =>{
        scrollRef?.current?.scrollTo({
            y:0,
            animated:true
        })
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

    console.log('active ', activeCategory);


    const openFiltersModal = () => {
        modelRef?.current?.present();
    }
    const closeFiltersModal = () => {
        modelRef?.current?.close();
    }

    return (
        <View style={[styles.conatainer, { paddingTop }]}>
            {/* header */}
            <View style={styles.header}>
                <Pressable  onPress={hanleScrollUp}>
                    <Text style={styles.title}>
                        Pixels
                    </Text>
                </Pressable>
                <Pressable onPress={openFiltersModal}>
                    <FontAwesome6 name="bars-staggered" size={22} color={theme.colors.neutral(0.7)} />
                </Pressable>
            </View>
            <ScrollView
 
                onScroll={hanleScroll}
                scrollEventThrottle={5}
                ref={scrollRef}
                contentContainerStyle={{ gap: 15 }}
            >
                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <View style={styles.searchBar}>
                        <Feather name="search" size={24} color={theme.colors.neutral(0.4)} />
                    </View>
                    <TextInput placeholder='Search...'
                        // value={search}
                        ref={searchInputRef}
                        onChangeText={handleTextDebounce}
                        style={styles.searchInput}
                    />
                    {
                        search && (
                            <Pressable
                                onPress={() => handleSearch("")}
                                style={styles.closeIcon}>
                                <Ionicons name="close" size={24} color={theme.colors.neutral(0.6)}
                                />
                            </Pressable>
                        )
                    }
                </View>
                {/* Categories */}
                <View style={styles.categories}>
                    <Categories activeCategory={activeCategory} hanleChangeCategory={hanleChangeCategory} />
                </View>

                {/* Filters */}
                {
                    filters && (
                        <View>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.filters}>
                                {
                                    Object.keys(filters).map((key, index) => {
                                        return (

                                            <View key={key} style={styles.filterItem}>
                                                {
                                                    key=='colors'?(
                                                        <View style={{
                                                            height:20,
                                                            width:30,
                                                            borderRadius:7,
                                                            backgroundColor:filters[key]
                                                        }}/>

                                                    ):(
                                                        <Text style={styles.filterItemText}>{filters[key]}</Text>
                                                    )
                                                }
                                               
                                                <Pressable
                                                    style={styles.filterCloseIcon}
                                                    onPress={() => clearThisFilter(key)}>
                                                    <Ionicons name='close' size={14} color={theme.colors.neutral(0.9)} />
                                                </Pressable>
                                            </View>

                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    )
                }

                {/* Images masonry grid */}
                <View>
                    {
                        images.length > 0 && <ImagGrid images={images} router={router} />
                    }
                </View>

                {/* loading */}

                <View style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}>
                    <ActivityIndicator size="large" />
                </View>


            </ScrollView>
            {/* filters */}

            <FiltersModal
                modelRef={modelRef}
                filters={filters}
                setFilters={setFilters}
                onClose={closeFiltersModal}
                onApply={applyFilters}
                onReset={resetFilters}
            />

        </View>
    )
}

const styles = StyleSheet.create({

    conatainer: {
        flex: 1,
        gap: 15,
    },

    header: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: hp(4),
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.neutral(0.9)
    },
    searchBar: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        backgroundColor: theme.colors.white,
        padding: 6,
        paddingLeft: 10,
        borderRadius: theme.radius.lg,

    },
    searchIcon: {
        padding: 8,

    },
    searchInput: {
        flex: 1,
        borderRadius: theme.radius.sm,
        paddingVertical: 10,
        fontSize: hp(1.8)
    },
    closeIcon: {
        backgroundColor: theme.colors.neutral(0.1),
        padding: 8,
        borderRadius: theme.radius.smx
    },
    filters: {
        paddingHorizontal: wp(4),
        gap: 10,
    },
    filterItem: {
        backgroundColor: theme.colors.grayBG,
        padding: 3,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.radius.xs,
        padding: 8,
        gap: 10,
        paddingHorizontal: 10

    },
    filterItemText: {
        fontSize: hp(1.9)
    },
    filterCloseIcon: {
        backgroundColor: theme.colors.neutral(0.2),
        padding: 4,
        borderRadius: 7
    }

})

export default HomeScreen