import { useEffect, useState } from 'react';
import { router, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://localhost:8080";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/authentication/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };

  const checkAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      
      if (!storedToken) {
        if (!pathname.includes('/authentication/')) {
          router.replace('/(drawer)/(tabs)/authentication/login');
        }
        setToken(null);
        return;
      }

      const isValid = await validateToken(storedToken);
      
      if (!isValid) {
        await AsyncStorage.removeItem('token');
        if (!pathname.includes('/authentication/')) {
          router.replace('/(drawer)/(tabs)/authentication/login');
        }
        setToken(null);
        return;
      }

      setToken(storedToken);
    } catch (error) {
      console.error('Error checking auth:', error);
      if (!pathname.includes('/authentication/')) {
        router.replace('/(drawer)/(tabs)/authentication/login');
      }
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  return { token, isLoading, checkAuth };
}; 