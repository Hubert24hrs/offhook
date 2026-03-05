// OFFHOOK — Navigation Type Definitions
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Root stack params
export type RootStackParamList = {
    Onboarding: undefined;
    Auth: undefined;
    Main: NavigatorScreenParams<TabParamList>;
    Result: undefined;
    Premium: undefined;
};

// Bottom tab params
export type TabParamList = {
    Home: undefined;
    Generator: { contactId?: string; contactName?: string; relationship?: string } | undefined;
    Contacts: undefined;
    Settings: undefined;
};

// Screen prop types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<TabParamList, T>,
        NativeStackScreenProps<RootStackParamList>
    >;

// Global declaration for useNavigation
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
