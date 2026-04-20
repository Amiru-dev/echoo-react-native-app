import { Text, TouchableOpacity, View, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeOption, useTheme } from "../theme/ThemeProvider";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { Ionicons } from "@expo/vector-icons";

const options: ThemeOption[] = ["light", "dark", "system"];
type SettingScreenProp = NativeStackNavigationProp<RootStack, "SettingScreen">;

export default function SettingScreen() {
  const { preference, applied, setPreference } = useTheme();
  const navigation = useNavigation<SettingScreenProp>();
  
  // New settings states
  const [notifications, setNotifications] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState("English");
  const [fontSize, setFontSize] = useState("Medium");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Settings",
      headerStyle: {
        backgroundColor: applied === "dark" ? "#1a1a1a" : "#ffffff",
      },
      headerTintColor: applied === "dark" ? "white" : "black",
    });
  }, [navigation, applied]);

  const getThemeIcon = (option: ThemeOption) => {
    switch (option) {
      case "light": return "sunny";
      case "dark": return "moon";
      case "system": return "phone-portrait";
      default: return "settings";
    }
  };

  const themeCardColors = {
    light: {
      bg: applied === "dark" ? "#2d3748" : "#f7fafc",
      border: applied === "dark" ? "#4a5568" : "#e2e8f0",
      text: applied === "dark" ? "white" : "#2d3748"
    },
    dark: {
      bg: applied === "dark" ? "#2d3748" : "#f7fafc",
      border: applied === "dark" ? "#4a5568" : "#e2e8f0",
      text: applied === "dark" ? "white" : "#2d3748"
    },
    system: {
      bg: applied === "dark" ? "#2d3748" : "#f7fafc",
      border: applied === "dark" ? "#4a5568" : "#e2e8f0",
      text: applied === "dark" ? "white" : "#2d3748"
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={["right", "bottom", "left"]}>
      <StatusBar 
        hidden={false} 
        barStyle={applied === "dark" ? "light-content" : "dark-content"}
      />
      
      <ScrollView 
        className="flex-1 bg-white dark:bg-gray-900"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            App Settings
          </Text>
          <Text className="text-base text-gray-600 dark:text-gray-400 mt-1">
            Customize your app experience
          </Text>
        </View>

        {/* Theme Selection Section */}
        <View className="mx-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </Text>
          
          <View className="flex-row justify-between space-x-3">
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                className={`flex-1 items-center py-4 px-3 rounded-2xl border-2 ${
                  preference === option 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                }`}
                onPress={() => setPreference(option)}
              >
                <Ionicons 
                  name={getThemeIcon(option)} 
                  size={24} 
                  color={preference === option ? "#3b82f6" : (applied === "dark" ? "#9ca3af" : "#6b7280")} 
                />
                <Text 
                  className={`text-sm font-medium mt-2 ${
                    preference === option 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
                {preference === option && (
                  <View className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Settings Sections */}
        
        {/* Notifications */}
        <View className="mx-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Preferences
          </Text>
          
          <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden">
            <View className="flex-row items-center justify-between py-4 px-4 border-b border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center">
                <Ionicons 
                  name="notifications" 
                  size={20} 
                  color={applied === "dark" ? "#9ca3af" : "#6b7280"} 
                />
                <Text className="text-base font-medium text-gray-900 dark:text-white ml-3">
                  Push Notifications
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
                thumbColor={notifications ? "#ffffff" : "#f3f4f6"}
              />
            </View>

            <View className="flex-row items-center justify-between py-4 px-4 border-b border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center">
                <Ionicons 
                  name="finger-print" 
                  size={20} 
                  color={applied === "dark" ? "#9ca3af" : "#6b7280"} 
                />
                <Text className="text-base font-medium text-gray-900 dark:text-white ml-3">
                  Biometric Authentication
                </Text>
              </View>
              <Switch
                value={biometricAuth}
                onValueChange={setBiometricAuth}
                trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
                thumbColor={biometricAuth ? "#ffffff" : "#f3f4f6"}
              />
            </View>

            <View className="flex-row items-center justify-between py-4 px-4">
              <View className="flex-row items-center">
                <Ionicons 
                  name="save" 
                  size={20} 
                  color={applied === "dark" ? "#9ca3af" : "#6b7280"} 
                />
                <Text className="text-base font-medium text-gray-900 dark:text-white ml-3">
                  Auto Save
                </Text>
              </View>
              <Switch
                value={autoSave}
                onValueChange={setAutoSave}
                trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
                thumbColor={autoSave ? "#ffffff" : "#f3f4f6"}
              />
            </View>
          </View>
        </View>

        {/* Language & Display */}
        <View className="mx-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Language & Display
          </Text>
          
          <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden">
            <TouchableOpacity className="flex-row items-center justify-between py-4 px-4 border-b border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center">
                <Ionicons 
                  name="language" 
                  size={20} 
                  color={applied === "dark" ? "#9ca3af" : "#6b7280"} 
                />
                <Text className="text-base font-medium text-gray-900 dark:text-white ml-3">
                  Language
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-base text-gray-600 dark:text-gray-400 mr-2">
                  {language}
                </Text>
                <Ionicons 
                  name="chevron-forward" 
                  size={16} 
                  color={applied === "dark" ? "#9ca3af" : "#6b7280"} 
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-4 px-4">
              <View className="flex-row items-center">
                <Ionicons 
                  name="text" 
                  size={20} 
                  color={applied === "dark" ? "#9ca3af" : "#6b7280"} 
                />
                <Text className="text-base font-medium text-gray-900 dark:text-white ml-3">
                  Font Size
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-base text-gray-600 dark:text-gray-400 mr-2">
                  {fontSize}
                </Text>
                <Ionicons 
                  name="chevron-forward" 
                  size={16} 
                  color={applied === "dark" ? "#9ca3af" : "#6b7280"} 
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View className="mx-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Support
          </Text>
          
          <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden">
            <TouchableOpacity className="flex-row items-center py-4 px-4 border-b border-gray-200 dark:border-gray-700">
              <Ionicons 
                name="help-circle" 
                size={20} 
                color={applied === "dark" ? "#9ca3af" : "#6b7280"} 
              />
              <Text className="text-base font-medium text-gray-900 dark:text-white ml-3">
                Help & Support
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-4 px-4 border-b border-gray-200 dark:border-gray-700">
              <Ionicons 
                name="shield-checkmark" 
                size={20} 
                color={applied === "dark" ? "#9ca3af" : "#6b7280"} 
              />
              <Text className="text-base font-medium text-gray-900 dark:text-white ml-3">
                Privacy Policy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-4 px-4">
              <Ionicons 
                name="document-text" 
                size={20} 
                color={applied === "dark" ? "#9ca3af" : "#6b7280"} 
              />
              <Text className="text-base font-medium text-gray-900 dark:text-white ml-3">
                Terms of Service
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View className="mx-6 mb-8 items-center">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Version 1.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}