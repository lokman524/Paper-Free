import { View, Text } from 'react-native'
import React from 'react'
import { images } from '@/constants/images'
import { Image } from 'react-native'

const settings = () => {
  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
      <Text className="text-5xl text-white font-bold mt-5 mb-3">設定</Text>
    </View>
  )
}

export default settings;