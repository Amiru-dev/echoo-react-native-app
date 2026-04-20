// screens/StatusScreen.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CameraButton from "../components/StatusButton";

type StatusItem = {
  id: string;
  name: string;
  time: string;
  isMyStatus: boolean;
  avatar: string;
};

const StatusScreen = () => {
  // Mock status data with proper typing
  const statusUpdates: StatusItem[] = [
    {
      id: '1',
      name: 'My Status',
      time: 'Just now',
      isMyStatus: true,
      avatar: 'https://ui-avatars.com/api/?name=Amiru+Upek&background=random'
    },
    {
      id: '2',
      name: 'Shehan Minura',
      time: '10 minutes ago',
      isMyStatus: false,
      avatar: 'https://ui-avatars.com/api/?name=Shehan+Minura&background=random'
    },
    {
      id: '3',
      name: 'Kanthi Nimesha',
      time: '45 minutes ago',
      isMyStatus: false,
      avatar: 'https://ui-avatars.com/api/?name=Kanthi+Nimesha&background=random'
    }
  ];

  // Properly type the render function
  const renderStatusItem = ({ item }: { item: StatusItem }) => (
    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100 active:bg-gray-50">
      <View className="relative">
        <View className="w-14 h-14 rounded-full border-2 border-green-500 justify-center items-center">
          <Image
            source={{ uri: item.avatar }}
            className="w-12 h-12 rounded-full"
          />
        </View>
        {item.isMyStatus && (
          <View className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-6 h-6 border-2 border-white justify-center items-center">
            <Text className="text-white text-lg font-bold">+</Text>
          </View>
        )}
      </View>
      <View className="ml-4 flex-1">
        <Text className="font-semibold text-lg text-gray-800">{item.name}</Text>
        <Text className="text-gray-500 text-sm">{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* My Status Header */}
      <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200 active:bg-gray-50">
        <View className="relative">
          <View className="w-16 h-16 rounded-full border-2 border-gray-300 justify-center items-center">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }}
              className="w-14 h-14 rounded-full"
            />
          </View>
          <View className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-6 h-6 border-2 border-white justify-center items-center">
            <Text className="text-white text-lg font-bold">+</Text>
          </View>
        </View>
        <View className="ml-4 flex-1">
          <CameraButton />
          <Text className="font-bold text-lg text-gray-800">My Status</Text>
          <Text className="text-gray-500">Tap to add status update</Text>
        </View>
      </TouchableOpacity>

      {/* Recent Updates */}
      <View className="py-2">
        <Text className="px-4 py-2 text-gray-500 text-sm font-semibold">Recent updates</Text>
      </View>

      <FlatList
        data={statusUpdates.filter(item => !item.isMyStatus)}
        renderItem={renderStatusItem}
        keyExtractor={(item: StatusItem) => item.id}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity className="bg-green-500 w-14 h-14 rounded-full justify-center items-center shadow-lg shadow-green-500/30">
          <Text className="text-white text-2xl font-bold">✏️</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StatusScreen;