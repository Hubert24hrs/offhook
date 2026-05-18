import { useExcuseStore } from './excuseStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock dependencies
jest.mock('../core/ai', () => ({
  historyManager: {
    logExcuse: jest.fn().mockResolvedValue(undefined),
    initialize: jest.fn().mockResolvedValue(undefined),
    getLastExcuses: jest.fn().mockReturnValue([]),
    getTotalExcusesToday: jest.fn().mockReturnValue(0),
  },
}));

jest.mock('../core/ai/ai_service', () => ({
  generateExcuse: jest.fn().mockResolvedValue({
    excuse_text: 'Test excuse',
    risk_score: 2,
    risk_reason: 'Low risk',
  }),
}));

jest.mock('../core/services/context', () => ({
  buildRealContext: jest.fn().mockResolvedValue({}),
}));

// Mock React Native Reanimated to avoid ESM issues in tests
jest.mock('react-native-reanimated', () => ({}));

describe('excuseStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have default state', () => {
    const state = useExcuseStore.getState();
    expect(state.isGenerating).toBe(false);
    expect(state.currentExcuse).toBe(null);
    expect(state.selectedCategory).toBe('traffic');
  });

  it('should set selection', () => {
    useExcuseStore.getState().setSelection('selectedCategory', 'work');
    const state = useExcuseStore.getState();
    expect(state.selectedCategory).toBe('work');
  });

  it('should check canGenerate', () => {
    const state = useExcuseStore.getState();
    expect(state.canGenerate()).toBe(true);
  });

  it('should clear current excuse', () => {
    useExcuseStore.setState({ currentExcuse: { excuse_text: 'test', risk_score: 1, risk_reason: 'test' } });
    useExcuseStore.getState().clearCurrentExcuse();
    const state = useExcuseStore.getState();
    expect(state.currentExcuse).toBe(null);
  });
});
