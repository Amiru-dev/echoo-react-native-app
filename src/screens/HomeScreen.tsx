import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useChatList } from "../socket/UseChatList";
import { formatChatTime } from "../util/DateFormatter";
import { Chat } from "../socket/chat";
import { AuthContext } from "../components/AuthProvider";
import CameraButton from "../components/CameraButton";

type HomeScreenProps = NativeStackNavigationProp<RootStack, "HomeScreen">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps>();
  const [search, setSearch] = useState("");
  const chatList = useChatList();
  const [isModalVisible, setModalVisible] = useState(false);
  const auth = useContext(AuthContext);

  // Custom Header Component
  const CustomHeader = () => (
    <View
      className={`h-20 bg-white justify-center items-center flex-row shadow-2xl elevation-2xl ${Platform.OS === "ios" ? `py-5` : `py-0`
        }`}
    >
      <View className="flex-1 items-start ms-3">
        <Text className="font-bold text-2xl">Echoo</Text>
      </View>
      <View className="me-3">
        <View className="flex-row space-x-4 items-center">
          {/* Camera Button */}
          <CameraButton />

          {/* Settings Button */}
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
            className="p-2"
          >
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <CustomHeader />,
    });
  }, [navigation]);

  const filterdChats = [...chatList]
    .filter((chat) => {
      return (
        chat.friendName.toLowerCase().includes(search.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort(
      (a, b) =>
        new Date(b.lastTimeStamp).getTime() -
        new Date(a.lastTimeStamp).getTime()
    );

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      className="flex-row items-center py-2 px-3 bg-gray-50 my-0.5"
      onPress={() => {
        navigation.navigate("SingleChatScreen", {
          chatId: item.friendId,
          friendName: item.friendName,
          lastSeenTime: formatChatTime(item.lastTimeStamp),
          profileImage: item.profileImage
            ? item.profileImage
            : `https://ui-avatars.com/api/?name=${item.friendName.replace(
              " ",
              "+"
            )}&background=random`,
        });
      }}
    >
      <TouchableOpacity className="h-14 w-14 rounded-full border-1 border-gray-300 justify-center items-center">
        {item.profileImage ? (
          <Image
            source={{ uri: item.profileImage }}
            className="h-14 w-14 rounded-full"
          />
        ) : (
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?name=${item.friendName.replace(
                " ",
                "+"
              )}&background=random`,
            }}
            className="h-14 w-14 rounded-full"
          />
        )}
      </TouchableOpacity>
      <View className="flex-1 ms-3">
        <View className="flex-row justify-between">
          <Text
            className="font-bold text-xl text-gray-600"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.friendName}
          </Text>
          <Text className="font-bold text-xs text-gray-500">
            {formatChatTime(item.lastTimeStamp)}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text
            className="text-gray-500 flex-1 text-base"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View className="bg-green-500 rounded-full px-2 py-2 ms-2">
              <Text className="text-slate-50 text-xs font-bold">
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-white p-0"
      edges={["right", "bottom", "left"]}
    >
      <StatusBar hidden={false} />

      {/* Settings Modal */}
      <Modal
        animationType="fade"
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-transparent"
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <Pressable
            className="bg-red-100"
            onPress={(e) => {
              e.stopPropagation();
            }}
          >
            <View className="justify-end items-end p-5">
              <View
                className="bg-white rounded-2xl w-72 p-1"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 10,
                }}
              >
                {/* Settings Option */}
                <TouchableOpacity
                  className="flex-row items-center px-4 py-4 active:bg-gray-50 rounded-t-2xl"
                  onPress={() => {
                    navigation.navigate("SettingScreen");
                    setModalVisible(false);
                  }}
                >
                  <View className="w-10 h-10 bg-blue-100 rounded-full justify-center items-center mr-3">
                    <Ionicons name="settings-outline" size={20} color="#3b82f6" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800 text-base">Settings</Text>
                    <Text className="text-gray-500 text-xs">App preferences and configuration</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                </TouchableOpacity>

                <View className="h-px bg-gray-100 mx-4" />

                {/* My Profile Option */}
                <TouchableOpacity
                  className="flex-row items-center px-4 py-4 active:bg-gray-50"
                  onPress={() => {
                    navigation.navigate("ProfileScreen");
                    setModalVisible(false);
                  }}
                >
                  <View className="w-10 h-10 bg-green-100 rounded-full justify-center items-center mr-3">
                    <Ionicons name="person-outline" size={20} color="#10b981" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800 text-base">My Profile</Text>
                    <Text className="text-gray-500 text-xs">View and edit your profile</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                </TouchableOpacity>

                <View className="h-px bg-gray-100 mx-4" />

                {/* Log Out Option */}
                <TouchableOpacity
                  className="flex-row items-center px-4 py-4 active:bg-red-50 rounded-b-2xl"
                  onPress={() => {
                    if (auth) auth.signOut();
                  }}
                >
                  <View className="w-10 h-10 bg-red-100 rounded-full justify-center items-center mr-3">
                    <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-red-600 text-base">Log Out</Text>
                    <Text className="text-gray-500 text-xs">Sign out of your account</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Search Bar */}
      <View className="items-center flex-row mx-2 border-gray-300 border-2 rounded-full px-3 h-14 mt-3">
        <Ionicons name="search" size={20} color={"gray"} />
        <TextInput
          className="flex-1 text-lg font-bold ps-2"
          placeholder="Search"
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>

      {/* Chat List */}
      <View className="mt-1">
        <FlatList
          data={filterdChats}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      {/* New Chat Button */}
      <View className="absolute bg-green-500 bottom-16 right-10 h-20 w-20 rounded-3xl">
        <TouchableOpacity
          className="h-20 w-20 rounded-3xl justify-center items-center"
          onPress={() => navigation.navigate("NewChatScreen")}
        >
          <Ionicons name="chatbox-ellipses" size={26} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}