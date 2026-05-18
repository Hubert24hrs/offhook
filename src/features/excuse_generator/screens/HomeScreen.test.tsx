import React from 'react';
import { render } from '@testing-library/react-native';
import { HomeScreen } from './HomeScreen';

// Mock the navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock the stores
jest.mock('../../../stores/excuseStore', () => ({
  useExcuseStore: () => ({
    dailyGenerations: 0,
    maxDailyFree: 5,
    excuseHistory: [],
    loadHistory: jest.fn(),
  }),
}));

jest.mock('../../../stores/contactStore', () => ({
  useContactStore: () => ({
    contacts: [],
    loadContacts: jest.fn(),
  }),
}));

jest.mock('../../../stores/userStore', () => ({
  useUserStore: () => ({
    username: 'Test User',
    loadUser: jest.fn(),
  }),
}));

jest.mock('../../../stores/monetizationStore', () => ({
  useMonetizationStore: () => ({
    hasPremiumAccess: () => false, // Mocked as a function
    setPaywallVisible: jest.fn(),
  }),
}));

describe('HomeScreen', () => {
  it('renders correctly', () => {
    try {
      const { toJSON } = render(<HomeScreen />);
      expect(toJSON()).toBeTruthy();
    } catch (error) {
      console.error('Render error:', error);
      throw error;
    }
  });
});
