// OFFHOOK — Main App Entry Point
// Navigation and screen management
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, Text, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Colors } from './src/core/theme';
import { useUserStore } from './src/stores/userStore';
import { AppNavigator } from './src/navigation/AppNavigator';

// Error boundary for web debugging
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: '#0A0A1A', justifyContent: 'center', padding: 40 }}>
          <Text style={{ color: '#FF6B6B', fontSize: 20, fontWeight: '700', marginBottom: 16 }}>
            OFFHOOK Error
          </Text>
          <Text style={{ color: '#FFF', fontSize: 14, lineHeight: 22 }}>
            {String(this.state.error)}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const DarkNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.primary,
    card: Colors.primary,
    text: Colors.textPrimary,
    border: Colors.glassBorder,
    primary: Colors.accent1,
  },
};

export default function App() {
  const { loadUser } = useUserStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    await loadUser();
    // Brief splash delay for branding
    setTimeout(() => {
      setIsReady(true);
    }, 1500);
  };

  // Splash screen
  if (!isReady) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        <LinearGradient
          colors={[Colors.accent1, '#8B85FF', Colors.accent2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.splashLogoBg}
        >
          <Text style={styles.splashEmoji}>⚡</Text>
        </LinearGradient>
        <Text style={styles.splashTitle}>OFFHOOK</Text>
        <Text style={styles.splashSubtitle}>The World's Smartest Excuse Engine</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        <NavigationContainer theme={DarkNavTheme}>
          <AppNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </ErrorBoundary>
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
  splashLogoBg: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.accent1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 15,
  },
  splashEmoji: {
    fontSize: 48,
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 6,
  },
  splashSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 8,
    letterSpacing: 1,
  },
});
