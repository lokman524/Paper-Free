import { View, Text } from 'react-native'
import React from 'react'

const Dashboard = () => {
const rank = Math.floor(Math.random() * 100) + 1;
  return (
    <View>
      <Text className='text-white'>Ranking: you are in the first {rank}% of all the users</Text>
    </View>
  )
}

export default Dashboard;