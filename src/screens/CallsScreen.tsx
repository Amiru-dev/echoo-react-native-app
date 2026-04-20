// screens/CallsScreen.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Define the type for call items
type CallItem = {
  id: string;
  name: string;
  time: string;
  type: 'outgoing' | 'incoming' | 'missed';
  avatar: string;
};

const CallsScreen = () => {
  // Mock call history with proper typing
  const callHistory: CallItem[] = [
    {
      id: '1',
      name: 'Shehan Minura',
      time: 'Today, 2:30 PM',
      type: 'outgoing',
      avatar: 'https://ui-avatars.com/api/?name=Shehan+Minura&background=random'
    },
    {
      id: '2',
      name: 'Surath Chamara', 
      time: 'Yesterday, 10:15 AM',
      type: 'incoming',
      avatar: 'https://ui-avatars.com/api/?name=Surath+Chamara&background=random'
    },
    {
      id: '3',
      name: 'Rasika Kumara',
      time: 'Yesterday, 9:45 AM',
      type: 'missed',
      avatar: 'https://ui-avatars.com/api/?name=Rasika+Kumara&background=random'
    }
  ];

  const getCallIcon = (type: CallItem['type']) => {
    switch (type) {
      case 'outgoing': return 'arrow-up-outline';
      case 'incoming': return 'arrow-down-outline'; 
      case 'missed': return 'arrow-down-outline';
      default: return 'call-outline';
    }
  };

  const getCallColor = (type: CallItem['type']) => {
    switch (type) {
      case 'missed': return 'text-red-500';
      default: return 'text-gray-600';
    }
  };

  // Properly type the render function
  const renderCallItem = ({ item }: { item: CallItem }) => (
    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100 active:bg-gray-50">
      <Image
        source={{ uri: item.avatar }}
        className="w-12 h-12 rounded-full"
      />
      <View className="ml-4 flex-1">
        <Text className={`font-semibold text-lg ${getCallColor(item.type)}`}>
          {item.name}
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons 
            name={getCallIcon(item.type)} 
            size={16} 
            color={item.type === 'missed' ? '#ef4444' : '#6b7280'} 
          />
          <Text className="text-gray-500 text-sm ml-2">{item.time}</Text>
        </View>
      </View>
      <TouchableOpacity className="p-3 bg-gray-100 rounded-full">
        <Ionicons name="call" size={20} color="#10b981" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={callHistory}
        renderItem={renderCallItem}
        keyExtractor={(item: CallItem) => item.id}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Floating call button */}
      <TouchableOpacity className="absolute bottom-6 right-6 bg-green-500 w-14 h-14 rounded-full justify-center items-center shadow-lg shadow-green-500/30 active:bg-green-600">
        <Ionicons name="call" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CallsScreen;