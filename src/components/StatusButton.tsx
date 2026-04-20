import React, { useState, useRef, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    Image,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import {
    ALERT_TYPE,
    AlertNotificationRoot,
    Toast,
} from "react-native-alert-notification";

const CameraButton = () => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [photo, setPhoto] = useState<string | null>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRequestingPermission, setIsRequestingPermission] = useState(false);

    // Auto-request permission when component mounts
    useEffect(() => {
        const initializeCamera = async () => {
            if (permission && !permission.granted && !isRequestingPermission) {
                console.log('🟡 Auto-requesting camera permission...');
                setIsRequestingPermission(true);
                const permissionResult = await requestPermission();
                console.log('🟡 Auto-permission result:', permissionResult.granted);
                setIsRequestingPermission(false);
            }
        };

        initializeCamera();
    }, [permission]);

    const openCamera = async () => {
        console.log('🎯 CAMERA BUTTON CLICKED - Starting openCamera');

        if (!permission) {
            console.log('🟡 Permission object not ready yet');
            Alert.alert('Info', 'Camera permissions are still loading...');
            return;
        }

        console.log('🟡 Current permission status:', permission.granted);

        if (!permission.granted) {
            console.log('🟡 Requesting camera permission via button click...');
            setIsRequestingPermission(true);
            const permissionResult = await requestPermission();
            console.log('🟡 Button-click permission result:', permissionResult);
            setIsRequestingPermission(false);

            if (!permissionResult.granted) {
                Alert.alert(
                    'Permission Required',
                    'Camera permission is needed to take photos. Please enable it in your device settings.',
                    [
                        { text: 'OK' },
                        {
                            text: 'Open Settings', onPress: () => {
                                // This would typically open app settings
                                console.log('Should open settings');
                            }
                        }
                    ]
                );
                return;
            }
        }

        console.log('🟢 SUCCESS - Opening camera modal');
        setIsCameraOpen(true);
        setPhoto(null);
    };

    const takePhoto = async () => {
        console.log('📸 Taking photo...');
        if (cameraRef.current) {
            try {
                setIsLoading(true);
                const photoResult = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: false,
                    exif: false,
                });

                setPhoto(photoResult.uri);
                console.log('✅ Photo taken successfully:', photoResult.uri);
            } catch (error) {
                console.error('❌ Error taking photo:', error);
                Alert.alert('Error', 'Failed to take photo');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const retakePhoto = () => {
        console.log('🔄 Retaking photo...');
        setPhoto(null);
    };

    const usePhoto = () => {
        if (photo) {
            console.log('✅ Using photo:', photo);
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: "Success",
                textBody: "Status uploaded successfully",
            });
            setIsCameraOpen(false);
            setPhoto(null);
        }
    };

    const closeCamera = () => {
        console.log('❌ Closing camera...');
        setIsCameraOpen(false);
        setPhoto(null);
    };

    // Show loading while permissions are being checked or requested
    if (!permission || isRequestingPermission) {
        return (
            <TouchableOpacity className="me-5 p-2">
                <ActivityIndicator size="small" color="black" />
                <Text style={{ fontSize: 8, textAlign: 'center' }}>Loading...</Text>
            </TouchableOpacity>
        );
    }

    return (
        <>
            <TouchableOpacity
                className="me-5 p-2"
                onPress={openCamera}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                style={{
                    opacity: permission.granted ? 1 : 0.6,
                }}
            >
                <Ionicons
                    name="camera"
                    size={26}
                    color={permission.granted ? "black" : "gray"}
                />
                {!permission.granted && (
                    <Text style={{ fontSize: 8, color: 'red', textAlign: 'center', marginTop: 2 }}>
                        Tap to enable
                    </Text>
                )}
            </TouchableOpacity>

            <Modal
                visible={isCameraOpen}
                animationType="slide"
                statusBarTranslucent
                onRequestClose={closeCamera}
            >
                <View className="flex-1 bg-black">
                    {!photo ? (
                        <View className="flex-1">
                            <CameraView
                                ref={cameraRef}
                                style={{ flex: 1 }}
                                facing="back"
                            />

                            <View className="absolute bottom-10 left-0 right-0 items-center">
                                <View className="flex-row justify-between items-center w-full px-8">
                                    <TouchableOpacity
                                        onPress={closeCamera}
                                        className="p-3"
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Ionicons name="close" size={30} color="white" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={takePhoto}
                                        disabled={isLoading}
                                        className="p-2 border-4 border-white rounded-full"
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator size="small" color="white" />
                                        ) : (
                                            <View className="w-16 h-16 bg-white rounded-full" />
                                        )}
                                    </TouchableOpacity>

                                    <View className="w-10" />
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View className="flex-1">
                            <Image
                                source={{ uri: photo }}
                                style={{ flex: 1 }}
                                resizeMode="contain"
                            />

                            <View className="absolute bottom-10 left-0 right-0 items-center">
                                <View className="flex-row justify-around items-center w-full px-8">
                                    <TouchableOpacity
                                        onPress={retakePhoto}
                                        className="items-center"
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Ionicons name="refresh" size={30} color="white" />
                                        <Text className="text-white text-center mt-1">Retake</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={usePhoto}
                                        className="items-center"
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Ionicons name="checkmark-circle" size={30} color="white" />
                                        <Text className="text-white text-center mt-1">Use Photo</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </Modal>
        </>
    );
};

export default CameraButton;