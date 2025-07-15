import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { images } from '@/constants/images'
import { Image } from 'react-native'
import useAuthStore from '@/store/auth.store'

const profile = () => {
  const { user } = useAuthStore();

  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />
      <ScrollView className='flex-1 px-5 pt-10'>
        <Text className='text-5xl text-white font-bold mt-5 mb-3'>Profile</Text>
        <Image source={{ uri: user?.avatar }} className='w-24 h-24 rounded-full' />
        <Text className='text-white text-xl mb-5'>Name: {user?.name}</Text>
        <Text className='text-white text-xl mb-5'>Email: {user?.email}</Text>
        <Text className='text-white text-xl mb-5'>Account ID: {user?.accountId}</Text>
      </ScrollView>
    </View>
  )
}

export default profile