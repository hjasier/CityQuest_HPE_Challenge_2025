import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hook personalizado para manejar la URL de la API
const useApiUrl = () => {
  const [apiUrl, setApiUrl] = useState(null);

  // Cargar la URL de la API desde AsyncStorage
  useEffect(() => {
    const loadApiUrl = async () => {
      const storedUrl = await AsyncStorage.getItem('SERVER_API_URL');
      setApiUrl(storedUrl); 
      console.log('API URL loaded from AsyncStorage:', storedUrl);
    };

    loadApiUrl();
  }, []);

  // Guardar la URL de la API en AsyncStorage
  const saveApiUrl = async (url) => {
    if (url) {
      await AsyncStorage.setItem('SERVER_API_URL', url);
      setApiUrl(url);
    }
  };

  return { apiUrl, saveApiUrl };
};

export default useApiUrl;
