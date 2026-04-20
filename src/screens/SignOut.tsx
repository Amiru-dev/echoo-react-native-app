import { useContext } from "react";
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../components/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";

type SignOutScreenProps = NativeStackNavigationProp<RootStack, 'SignOutScreen'>;

export default function SignOutScreen() {
  const auth = useContext(AuthContext);
  const navigation = useNavigation<SignOutScreenProps>();

  const handleLogout = async () => {
    try {
      if (auth) {
        await auth.signOut();
        // Navigate to SignInScreen after successful logout
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignInScreen' }],
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Button
        title="Log Out"
        onPress={handleLogout}
      />
    </SafeAreaView>
  );
}
