import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images } from '@/constants/images'
import { useRouter } from 'expo-router'
import { icons } from '@/constants/icons'
import SearchBar from '@/components/SearchBar'


const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");


  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />

      <FlatList 
        data={""}
        renderItem={() => <></>}
        className='px-5'
        numColumns={3}
        columnWrapperStyle ={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16
        }}
        contentContainerStyle={{paddingBottom: 100}}

        ListHeaderComponent={
          <>
            <View className='w-full flex-row justify-center mt-20 items-center'>
              <Image source={icons.logo} className='w-12 h-10' />
            </View>
            
            <View className='my-5'>
              <SearchBar 
                placeholder='Search...'
                value={searchQuery}
                onChangeText={(text: string) => {
                  setSearchQuery(text)
                }}
              />
            </View>

            {searchQuery.trim() && (
              <Text className='text-xl text-white font-bold'>
                Search Results for {''}
                <Text className='text-accent'>{searchQuery}</Text>
              </Text>
            )}
          </>
        }

      />
    </View>
  )
}

export default Search;