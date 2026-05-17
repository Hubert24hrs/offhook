// OFFHOOK — Root App Navigator
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUserStore } from '../stores/userStore';
import { OnboardingScreen } from '../features/onboarding/screens/OnboardingScreen';
import { AuthScreen } from '../features/auth/screens/AuthScreen';
import { ResultScreen } from '../features/excuse_generator/screens/ResultScreen';
import { PremiumScreen } from '../features/monetization/screens/PremiumScreen';
import { CreditPackScreen } from '../features/monetization/screens/CreditPackScreen';
import { TipJarScreen } from '../features/monetization/screens/TipJarScreen';
import { ReferralScreen } from '../features/monetization/screens/ReferralScreen';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    const { hasCompletedOnboarding, isAuthenticated } = useUserStore();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'fade',
                contentStyle: { backgroundColor: '#0A0A1A' },
            }}
        >
            {!hasCompletedOnboarding ? (
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            ) : !isAuthenticated ? (
                <Stack.Screen name="Auth" component={AuthScreen} />
            ) : (
                <>
                    <Stack.Screen
                        name="Main" component={TabNavigator} />
                    <Stack.Screen
                        name="Result"
                        component={ResultScreen}
                        options={{ animation: 'slide_from_bottom' }}
                    />
                    <Stack.Screen
                        name="Premium"
                        component={PremiumScreen}
                        options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
                    />
                    <Stack.Screen
                        name="CreditPack"
                        component={CreditPackScreen}
                        options={{ animation: 'slide_from_right' }}
                    />
                    <Stack.Screen
                        name="TipJar"
                        component={TipJarScreen}
                        options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
                    />
                    <Stack.Screen
                        name="Referral"
                        component={ReferralScreen}
                        options={{ animation: 'slide_from_right' }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};
