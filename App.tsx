// OFFHOOK — Main App Entry Point
// Navigation and screen management
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from './src/core/theme';
import { useUserStore } from './src/stores/userStore';

// Screens
import { OnboardingScreen } from './src/features/onboarding/screens/OnboardingScreen';
import { AuthScreen } from './src/features/auth/screens/AuthScreen';
import { HomeScreen } from './src/features/excuse_generator/screens/HomeScreen';
import { GeneratorScreen } from './src/features/excuse_generator/screens/GeneratorScreen';
import { ResultScreen } from './src/features/excuse_generator/screens/ResultScreen';
import { ContactScreen } from './src/features/contact_manager/screens/ContactScreen';
import { SettingsScreen } from './src/features/settings/screens/SettingsScreen';
import { PremiumScreen } from './src/features/monetization/screens/PremiumScreen';

type Screen = 'splash' | 'onboarding' | 'auth' | 'home' | 'generator' | 'result' | 'contacts' | 'settings' | 'premium';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const { hasCompletedOnboarding, isAuthenticated, loadUser } = useUserStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    await loadUser();
    setIsReady(true);

    // Simple splash delay
    setTimeout(() => {
      const store = useUserStore.getState();
      if (!store.hasCompletedOnboarding) {
        setCurrentScreen('onboarding');
      } else if (!store.isAuthenticated) {
        setCurrentScreen('auth');
      } else {
        setCurrentScreen('home');
      }
    }, 1500);
  };

  const navigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  // Splash screen
  if (currentScreen === 'splash' || !isReady) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        <View style={styles.splashContent}>
          <View style={styles.splashLogo}>
            <View style={styles.splashLogoBg}>
              <View style={styles.splashLogoInner}>
                <StatusBar barStyle="light-content" />
              </View>
            </View>
          </View>
          <View style={styles.splashTextContainer}>
            <StatusBar barStyle="light-content" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {currentScreen === 'onboarding' && (
        <OnboardingScreen
          onComplete={() => setCurrentScreen('auth')}
        />
      )}

      {currentScreen === 'auth' && (
        <AuthScreen
          onComplete={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'home' && (
        <HomeScreen onNavigate={navigate} />
      )}

      {currentScreen === 'generator' && (
        <GeneratorScreen onNavigate={navigate} />
      )}

      {currentScreen === 'result' && (
        <ResultScreen onNavigate={navigate} />
      )}

      {currentScreen === 'contacts' && (
        <ContactScreen onNavigate={navigate} />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen onNavigate={navigate} />
      )}

      {currentScreen === 'premium' && (
        <PremiumScreen onNavigate={navigate} />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  splashLogo: {
    marginBottom: 24,
  },
  splashLogoBg: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: Colors.accent1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 15,
  },
  splashLogoInner: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  splashTextContainer: {
    alignItems: 'center',
  },
});
