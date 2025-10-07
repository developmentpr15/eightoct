import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { SocialProvider } from './src/contexts/SocialContext';
import { WardrobeProvider } from './src/contexts/WardrobeContext';
import { CompetitionProvider } from './src/contexts/CompetitionContext';
import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/store/store';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <ThemeProvider>
            <AuthProvider>
              <SocialProvider>
                <WardrobeProvider>
                  <CompetitionProvider>
                    <NavigationContainer>
                      <StatusBar style="auto" />
                      <AppNavigator />
                    </NavigationContainer>
                  </CompetitionProvider>
                </WardrobeProvider>
              </SocialProvider>
            </AuthProvider>
          </ThemeProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}