import React from 'react'
import { Redirect, Tabs } from 'expo-router'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'
import { View, Text, ImageBackground } from 'react-native'
import { Image } from 'react-native'
import useAuthStore from '@/store/auth.store'

const TabIcon = ({focused, icon, title}: any) => {
    if(focused){ 
        return (
            <ImageBackground 
                source={images.highlight}
                className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
            >
                <Image source={icon} tintColor="#151312" className="size-5" />
                <Text className='text-secondary text-base font-semibold ml-2'>{title}</Text>
            </ImageBackground>
        )
    }
    return (
        <View className='size-full justify-center items-center mt-4 rounded-full'>
            <Image source={icon} tintColor="#A8B5DB" className='size-5'></Image>
        </View>
    )
}

const _layout = () => {

  return (
    <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            tabBarItemStyle: {
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            },
            tabBarStyle: {
                backgroundColor: '#0f0D23',
                paddingTop: 10,
                borderColor: '#0f0d23'
            }
        }}
    >
        <Tabs.Screen
            name="index"
            options={{
                title: 'Home',
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <TabIcon 
                        focused={focused}
                        icon={icons.home}
                        title="Home"
                    ></TabIcon>
                )
            }}
        />
        <Tabs.Screen
            name="saved"
            options={{
                title: 'Saved',
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <TabIcon 
                        focused={focused}
                        icon={icons.save}
                        title="Saved"
                    ></TabIcon>
                )
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
                title: 'Profile',
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <TabIcon 
                        focused={focused}
                        icon={icons.person}
                        title="Profile"
                    ></TabIcon>
                )
            }}
        />
    </Tabs>
  )
}

export default _layout