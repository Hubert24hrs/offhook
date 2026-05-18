jest.mock('react-native-reanimated', () => {
  const React = require('react');
  
  const mockComponent = (name) => {
    return (props) => React.createElement(name, props, props.children);
  };

  const mockAnimation = {
    duration: jest.fn().mockReturnThis(),
    delay: jest.fn().mockReturnThis(),
    springify: jest.fn().mockReturnThis(),
    damping: jest.fn().mockReturnThis(),
    stiffness: jest.fn().mockReturnThis(),
  };

  return {
    __esModule: true,
    default: {
      View: mockComponent('View'),
      Text: mockComponent('Text'),
      createAnimatedComponent: (c) => c,
    },
    FadeInDown: mockAnimation,
    FadeInRight: mockAnimation,
    FadeOut: mockAnimation,
    Easing: {
      bezier: jest.fn().mockReturnValue({}),
      ease: jest.fn(),
      linear: jest.fn(),
    },
    useSharedValue: (v) => ({ value: v }),
    useAnimatedStyle: (fn) => fn(),
    withTiming: (v) => v,
    withSpring: (v) => v,
    interpolate: (v, input, output) => v,
    Extrapolate: { CLAMP: 'clamp' },
  };
});

jest.mock('react-native-worklets', () => ({
  createSerializable: (v) => v,
}));
