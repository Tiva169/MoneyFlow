import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { initDatabase } from '../services/database';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    initDatabase().catch((error) => {
      console.error('Error initializing database:', error);
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add-transaction"
          options={{
            title: 'บันทึกรายการ',
            headerBackTitle: 'กลับ',
          }}
        />
        <Stack.Screen
          name="goals"
          options={{
            title: 'เป้าหมาย',
            headerBackTitle: 'กลับ',
          }}
        />
        <Stack.Screen
          name="add-goal"
          options={{
            title: 'เพิ่มเป้าหมาย',
            headerBackTitle: 'กลับ',
          }}
        />
        <Stack.Screen
          name="statistics"
          options={{
            title: 'สถิติ',
            headerBackTitle: 'กลับ',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
