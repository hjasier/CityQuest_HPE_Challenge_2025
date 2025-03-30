import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useApiUrl from '../hooks/useApiUrl';

const RequestApiUrlScreen = ({ navigation }) => {
    const { apiUrl, saveApiUrl } = useApiUrl();
    const [inputUrl, setInputUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Establecer el valor inicial desde la URL de la API almacenada
    useEffect(() => {
        if (apiUrl) {
            setInputUrl(apiUrl);
        }
    }, [apiUrl]);

    const handleSave = async () => {
        if (!inputUrl) {
            Alert.alert('Error', 'Por favor, ingrese una URL válida para la API');
            return;
        }

        setIsLoading(true);
        try {
            // Probar la conexión con la API antes de guardar
            const testUrl = inputUrl.endsWith('/') ? inputUrl : `${inputUrl}/`;
            const response = await fetch(`${testUrl}ping`, { 
                method: 'GET',
                timeout: 5000 
            });
            
            if (response.ok) {
                await saveApiUrl(inputUrl);
                setIsSaved(true);
                
            } else {
                Alert.alert('Error de Conexión', 'No se pudo conectar con el servidor de la API. Por favor, revise la URL e intente nuevamente.');
            }
        } catch (error) {
            Alert.alert(
                'Error de Conexión', 
                'No se pudo conectar con el servidor de la API. Por favor, revise la URL e intente nuevamente.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" />
            
            <View className="flex-1 px-6 pt-6">
                <View className="items-center mt-6 mb-8">
                    <Ionicons name="server-outline" size={48} color="#0066cc" />
                    <Text className="text-2xl font-bold text-gray-800 mt-3">Configurar Servidor API</Text>
                </View>
                
                {!isSaved ? (
                <View className="flex-row bg-blue-50 p-4 rounded-xl mb-6 items-start">
                    <Ionicons name="information-circle-outline" size={24} color="#0066cc" />
                    <Text className="text-gray-700 ml-3 flex-1">
                        El servidor API y AGENT no están deployeados en ningún servidor, por lo que necesitamos que ejecutes el backend en local y introduzcas la URL de tu servidor API para que la aplicación pueda conectarse a él
                    </Text>
                </View>

                ):(
                <View className="flex-row bg-green-50 p-4 rounded-xl mb-6 items-start">
                    <Ionicons name="checkmark-circle-outline" size={24} color="#28a745" />
                    <Text className="text-gray-700 ml-3 flex-1">
                        ¡URL de la API guardada! Reinicia la aplicación para continuar :)
                    </Text>
                </View>
                )}
                
                {!isSaved && (
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl p-4 mb-1">
                    <Ionicons name="link-outline" size={24} color="#0066cc" className="mr-3" />
                    <TextInput
                        className="flex-1 text-base text-gray-800 h-12"
                        value={inputUrl}
                        onChangeText={setInputUrl}
                        placeholder="http://192.168.1.144:5000"
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                    />
                    {inputUrl ? (
                        <TouchableOpacity onPress={() => setInputUrl('')}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    ) : null}
                </View>
                )}
                
                <Text className="text-xs text-gray-500 ml-2 mb-8">
                    Ejemplo: http://192.168.1.144:5000
                </Text>
                
                
                <TouchableOpacity 
                    className={`flex-row h-14 items-center justify-center rounded-xl ${isLoading ? 'bg-blue-300' : 'bg-blue-600'}`}
                    onPress={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : isSaved ? (
                        <>
                            <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                            <Text className="text-white font-medium ml-2">¡Guardado!</Text>
                        </>
                    ) : (
                        <>
                            <Ionicons name="save-outline" size={20} color="#ffffff" />
                            <Text className="text-white font-medium ml-2">Guardar y Conectar</Text>
                        </>
                    )}
                </TouchableOpacity>
                
                {apiUrl ? (
                    <View className="mt-8 bg-blue-50 rounded-xl p-4">
                        <Text className="text-gray-600 text-sm font-medium">URL actual de la API:</Text>
                        <Text className="text-blue-700 mt-1">{apiUrl}</Text>
                    </View>
                ) : null}
            </View>
        </SafeAreaView>
    );
};

export default RequestApiUrlScreen;