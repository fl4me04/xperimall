import { useEffect, useState } from 'react';
import { router, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "https://xperimall-backend.onrender.com";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const validateToken = async (token: string) => {
    try {
      console.log("Validating token:", token);
      const response = await fetch(`${API_URL}/authentication/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      console.log("Token validation response status:", response.status);
      return response.ok;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };

  const checkAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      console.log("Retrieved stored token:", storedToken ? "Token exists" : "No token");
      
      if (!storedToken) {
        if (!pathname.includes('/authentication/')) {
          router.replace('/(drawer)/(tabs)/authentication/login');
        }
        setToken(null);
        return;
      }

      const isValid = await validateToken(storedToken);
      console.log("Token validation result:", isValid);
      
      if (!isValid) {
        console.log("Token is invalid, removing from storage");
        await AsyncStorage.removeItem('token');
        if (!pathname.includes('/authentication/')) {
          router.replace('/(drawer)/(tabs)/authentication/login');
        }
        setToken(null);
        return;
      }

      console.log("Setting valid token");
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