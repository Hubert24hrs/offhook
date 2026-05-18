import { useUserStore } from './userStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock React Native Reanimated to avoid ESM issues in tests
jest.mock('react-native-reanimated', () => ({}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('userStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have default state', () => {
    const state = useUserStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.hasCompletedOnboarding).toBe(false);
    expect(state.username).toBe('');
  });

  it('should set onboarding complete', async () => {
    await useUserStore.getState().setOnboardingComplete();
    
    const state = useUserStore.getState();
    expect(state.hasCompletedOnboarding).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('should login', async () => {
    await useUserStore.getState().login('test@example.com', 'testuser');
    
    const state = useUserStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.email).toBe('test@example.com');
    expect(state.username).toBe('testuser');
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
