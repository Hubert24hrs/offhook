// OFFHOOK — Bottom Tab Navigator
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../features/excuse_generator/screens/HomeScreen';
import { GeneratorScreen } from '../features/excuse_generator/screens/GeneratorScreen';
import { ContactScreen } from '../features/contact_manager/screens/ContactScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { TabBar } from '../shared/components/TabBar';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Generator" component={GeneratorScreen} />
            <Tab.Screen name="Contacts" component={ContactScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};
