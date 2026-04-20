import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { useTheme } from "../theme/ThemeProvider";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { useState, useContext } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/AuthProvider";

type SignInProps = NativeStackNavigationProp<RootStack, "SignInScreen">;

interface SignInResponse {
  status: boolean;
  userId?: number;
  message?: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    contactNo: string;
    countryCode: string;
    status: string;
  };
}

export default function SignInScreen() {
  const navigation = useNavigation<SignInProps>();
  const { applied } = useTheme();
  const auth = useContext(AuthContext);

  const [phoneNo, setPhoneNo] = useState("");
  const [countryCode, setCountryCode] = useState("+94");
  const [isLoading, setIsLoading] = useState(false);

  const logo =
    applied === "dark"
      ? require("../../assets/logo-dark.png")
      : require("../../assets/logo.png");

  // Validation function
  const validatePhoneNo = (phone: string): string | null => {
    if (!phone) {
      return "Phone number is required";
    }
    // Remove any non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      return "Please enter a valid phone number (at least 9 digits)";
    }
    return null;
  };

  const validateCountryCode = (code: string): string | null => {
    if (!code) {
      return "Country code is required";
    }
    if (!code.startsWith('+')) {
      return "Country code must start with +";
    }
    const codeWithoutPlus = code.slice(1);
    if (!/^\d+$/.test(codeWithoutPlus)) {
      return "Country code must contain only numbers after +";
    }
    return null;
  };

  // Sign in function using AuthController endpoint with FormData
  const signInUser = async (phone: string, code: string): Promise<SignInResponse> => {
    try {
      const API = process.env.EXPO_PUBLIC_APP_URL + "/Echoo";

      const formData = new FormData();
      formData.append('countryCode', code);
      formData.append('contactNo', phone);

      console.log("Sending sign in request to AuthController:", {
        countryCode: code,
        contactNo: phone
      });

      const response = await fetch(API + "/AuthController", {
        method: "POST",
        body: formData,
        // Note: Don't set Content-Type header when using FormData
        // The browser will set it automatically with boundary
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const json: SignInResponse = await response.json();
      console.log("AuthController response:", json);

      return json;

    } catch (error) {
      console.error("Sign in API error:", error);
      throw error;
    }
  };

  const handleSignIn = async () => {
    // Validate inputs
    const countryCodeError = validateCountryCode(countryCode);
    const phoneError = validatePhoneNo(phoneNo);

    if (countryCodeError) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: countryCodeError,
      });
      return;
    }

    if (phoneError) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: phoneError,
      });
      return;
    }

    if (!auth) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Authentication service not available",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call AuthController endpoint
      const result = await signInUser(phoneNo, countryCode);

      if (result.status && result.userId) {
        // Convert userId to string (your AuthProvider expects string)
        const userId = String(result.userId);

        // Store user ID in context and AsyncStorage
        await auth.signUp(userId);

        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: result.message || "Signed in successfully!",
        });

        // The AuthProvider context will handle navigation automatically
        // based on the userId state change

      } else {
        // Handle failed sign in with specific error message from server
        throw new Error(result.message || "Sign in failed");
      }
    } catch (error: any) {
      console.error('Sign in error:', error);

      let errorMessage = "Sign in failed. Please try again.";

      if (error.message.includes('not found') || error.message.includes('No account found')) {
        errorMessage = "No account found with this phone number. Please sign up first.";
      } else if (error.message.includes('inactive') || error.message.includes('inactive')) {
        errorMessage = "Your account is inactive. Please contact support.";
      } else if (error.message.includes('network') || error.message.includes('Network')) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message.includes('Server error')) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message.includes('Country code') || error.message.includes('Contact number')) {
        // Use the server's validation message directly
        errorMessage = error.message;
      }

      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpRedirect = () => {
    navigation.navigate("SignUpScreen");
  };

  const clearFields = () => {
    setPhoneNo("");
    setCountryCode("+94");
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    setPhoneNo(cleaned);
  };

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "android" ? 100 : 100}
        className="flex-1 items-center bg-white dark:bg-slate-900"
      >
        <SafeAreaView className="justify-center items-center p-5 flex-1 w-full">
          <StatusBar
            hidden={true}
            backgroundColor={applied === "light" ? "#ffffff" : "#0f172a"}
            barStyle={applied === "light" ? "dark-content" : "light-content"}
          />

          {/* Logo */}
          <View className="mb-8">
            <Image source={logo} className="h-40 w-36" resizeMode="contain" />
          </View>

          {/* Welcome Text */}
          <View className="w-full justify-start items-start mb-8">
            <Text className="font-bold text-2xl text-slate-500 dark:text-slate-300 mb-2">
              Welcome Back!
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-base">
              Sign In to continue your conversation
            </Text>
          </View>

          {/* Phone Input Fields */}
          <View className="self-stretch w-full">
            {/* Country Code Input */}
            <View className="w-full my-3">
              <FloatingLabelInput
                label={"Country Code"}
                value={countryCode}
                onChangeText={setCountryCode}
                keyboardType="phone-pad"
                containerStyles={{
                  borderWidth: 1,
                  borderColor: applied === 'light' ? '#cbd5e1' : '#475569',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: applied === 'light' ? '#ffffff' : '#1e293b',
                }}
                customLabelStyles={{
                  colorFocused: applied === 'light' ? '#64748b' : '#cbd5e1',
                  colorBlurred: applied === 'light' ? '#64748b' : '#cbd5e1',
                  fontSizeFocused: 14,
                  fontSizeBlurred: 14,
                  topFocused: -20,
                }}
                inputStyles={{
                  color: applied === 'light' ? '#1e293b' : '#f1f5f9',
                  fontSize: 16,
                }}
              />
            </View>

            {/* Phone Number Input */}
            <View className="w-full my-3">
              <FloatingLabelInput
                label={"Phone Number"}
                value={phoneNo}
                onChangeText={formatPhoneNumber}
                keyboardType="number-pad"
                containerStyles={{
                  borderWidth: 1,
                  borderColor: applied === 'light' ? '#cbd5e1' : '#475569',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: applied === 'light' ? '#ffffff' : '#1e293b',
                }}
                customLabelStyles={{
                  colorFocused: applied === 'light' ? '#64748b' : '#cbd5e1',
                  colorBlurred: applied === 'light' ? '#64748b' : '#cbd5e1',
                  fontSizeFocused: 14,
                  fontSizeBlurred: 14,
                  topFocused: -20,
                }}
                inputStyles={{
                  color: applied === 'light' ? '#1e293b' : '#f1f5f9',
                  fontSize: 16,
                }}
              />
            </View>
          </View>

          {/* Sign In Button */}
          <View className="mt-8 w-full px-5">
            <Pressable
              className="bg-green-600 h-14 justify-center items-center rounded-full disabled:bg-green-400"
              onPress={handleSignIn}
              disabled={isLoading || !phoneNo || !countryCode}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text className="text-slate-100 font-bold text-lg">
                  Sign In
                </Text>
              )}
            </Pressable>
          </View>

          {/* Clear Button */}
          <View className="mt-4 w-full px-5">
            <Pressable
              className="bg-slate-500 h-12 justify-center items-center rounded-full"
              onPress={clearFields}
              disabled={isLoading}
            >
              <Text className="text-slate-100 font-bold text-base">
                Clear
              </Text>
            </Pressable>
          </View>

          {/* Sign Up Redirect */}
          <View className="mt-8 flex-row justify-center items-center">
            <Text className="text-slate-500 dark:text-slate-400 text-base">
              Don't have an account?{" "}
            </Text>
            <Pressable onPress={handleSignUpRedirect} disabled={isLoading}>
              <Text className="text-green-600 font-bold text-base">
                Sign Up
              </Text>
            </Pressable>
          </View>

          {/* Debug info (remove in production) */}
          {/* <View className="mt-4 p-2 bg-slate-100 rounded">
            <Text className="text-xs text-slate-600">
              Debug: {countryCode} {phoneNo}
            </Text>
          </View> */}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
}