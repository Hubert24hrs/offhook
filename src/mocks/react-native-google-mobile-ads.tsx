import React from 'react';
import { View, Text } from 'react-native';

export const TestIds = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
};

export const BannerAdSize = {
  BANNER: 'BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
  FULL_BANNER: 'FULL_BANNER',
  LEADERBOARD: 'LEADERBOARD',
  ADAPTIVE_BANNER: 'ADAPTIVE_BANNER',
};

export const AdEventType = {
  LOADED: 'loaded',
  ERROR: 'error',
  OPENED: 'opened',
  CLOSED: 'closed',
};

export const RewardedAdEventType = {
  LOADED: 'loaded',
  EARNED_REWARD: 'earned_reward',
};

// Mock Component
export const BannerAd = (props: any) => {
  return (
    <View style={{ height: 50, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }}>
      <Text>Banner Ad Mock ({props.size})</Text>
    </View>
  );
};

// Mock Classes/Objects
class MockAd {
  listeners: any = {};
  
  onAdEvent(callback: any) {
    return () => {};
  }
  
  load() {}
  show() {}
}

export const InterstitialAd = {
  createForAdRequest: () => new MockAd(),
};

export const RewardedAd = {
  createForAdRequest: () => new MockAd(),
};
