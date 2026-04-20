import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useContext, useLayoutEffect, useState } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUserProfile } from "../socket/UseUserProfile";
import { uploadProfileImage } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";

type ProfileScreenProp = NativeStackNavigationProp<RootStack, "ProfileScreen">;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenProp>();
  const { applied } = useTheme();
  const userProfile = useUserProfile();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Profile",
      headerStyle: {
        backgroundColor: applied === "dark" ? "#1a1a1a" : "#ffffff",
      },
      headerTintColor: applied === "dark" ? "white" : "black",
    });
  }, [navigation, applied]);

  const [image, setImage] = useState<string | null>(null);
  const auth = useContext(AuthContext);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadProfileImage(String(auth ? auth.userId : 0), result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Section */}
        <View className="items-center pt-8 pb-6 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
          <View className="relative">
            <View className="relative">
              {image ? (
                <Image
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                  source={{ uri: image }}
                />
              ) : (
                <Image
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                  source={{ uri: userProfile?.profileImage }}
                />
              )}
              <TouchableOpacity
                onPress={pickImage}
                className="absolute bottom-2 right-2 bg-blue-500 w-10 h-10 rounded-full items-center justify-center shadow-lg border-2 border-white"
              >
                <Feather name="camera" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View className="items-center mt-4">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {userProfile?.firstName} {userProfile?.lastName}
            </Text>
            <TouchableOpacity
              onPress={pickImage}
              className="flex-row items-center mt-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <Feather name="edit-2" size={14} color="#6b7280" />
              <Text className="text-gray-600 dark:text-gray-400 text-sm font-medium ml-2">
                Edit Profile Picture
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Information Cards */}
        <View className="px-6 mt-4">
          {/* Personal Information Card */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg items-center justify-center">
                <Feather name="user" size={16} color="#3b82f6" />
              </View>
              <Text className="text-lg font-semibold text-gray-900 dark:text-white ml-3">
                Personal Information
              </Text>
            </View>

            {/* Name Section */}
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Feather name="user" size={14} color="#6b7280" />
                <Text className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  Full Name
                </Text>
              </View>
              <View className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
                <Text className="text-base font-medium text-gray-900 dark:text-white">
                  {userProfile?.firstName} {userProfile?.lastName}
                </Text>
              </View>
            </View>

            {/* Phone Section */}
            <View>
              <View className="flex-row items-center mb-2">
                <Feather name="phone" size={14} color="#6b7280" />
                <Text className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  Phone Number
                </Text>
              </View>
              <View className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
                <Text className="text-base font-medium text-gray-900 dark:text-white">
                  {userProfile?.countryCode} {userProfile?.contactNo}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions Card */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </Text>
            
            <View className="flex-row justify-between">
              <TouchableOpacity className="items-center flex-1">
                <View className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="shield-checkmark" size={20} color="#10b981" />
                </View>
                <Text className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                  Privacy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center flex-1">
                <View className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="notifications" size={20} color="#8b5cf6" />
                </View>
                <Text className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                  Notifications
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center flex-1">
                <View className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="help-circle" size={20} color="#f59e0b" />
                </View>
                <Text className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                  Support
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center flex-1">
                <View className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="log-out" size={20} color="#ef4444" />
                </View>
                <Text className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Account Status */}
          <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mt-4 shadow-lg">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white text-sm font-medium opacity-90">
                  Account Status
                </Text>
                <Text className="text-white text-lg font-bold mt-1">
                  Verified ✓
                </Text>
              </View>
              <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                <Ionicons name="checkmark-done" size={24} color="white" />
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}