import { View, Text,Image,Pressable,TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';
import React from 'react';
import { router } from 'expo-router';

export default function Home() {
  const handlePress = () => {
    router.push('/home'); // Navigate to the todos page
  };

  return (
    <View style={tw`flex-1 bg-blue-600 pt-16`}>
      <StatusBar style="auto" />
      <Pressable  style={tw`px-6 py-14 `}>
        <Text 
          style={tw`text-4xl font-bold text-indigo-950 mb-8 text-center active:opacity-70`}
        >
          Todo App
        </Text>
        <View style={tw`items-center justify-center mb-8`}>
          <Image 
            source={require('../assets/todo.webp')}
            style={tw`w-64 h-64`}
            resizeMode="contain"
          />
        </View>
        <View style={tw`items-center`}>
          <TouchableOpacity
            style={[
              tw`px-8 py-4 bg-indigo-600 rounded-xl shadow-lg`,
              tw`active:bg-indigo-700 active:transform active:scale-95`,
              tw`border-2 border-indigo-700`
            ]}
            onPress={handlePress}
          >
            <Text style={tw`text-white font-bold text-xl text-center`}>
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </View>
  );
}
