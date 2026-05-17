import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { 
  InterstitialAd, 
  RewardedAd, 
  TestIds, 
  AdEventType, 
  RewardedAdEventType 
} from 'react-native-google-mobile-ads';
import { useMonetizationStore } from '../stores/monetizationStore';

// Use Test IDs during development
const interstitialAdUnitId = __DEV__ 
  ? TestIds.INTERSTITIAL 
  : Platform.OS === 'ios' ? 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyy' : 'ca-app-pub-xxxxxxxxxxxxx/zzzzzzzzz';

const rewardedAdUnitId = __DEV__ 
  ? TestIds.REWARDED 
  : Platform.OS === 'ios' ? 'ca-app-pub-xxxxxxxxxxxxx/aaaaaaaaa' : 'ca-app-pub-xxxxxxxxxxxxx/bbbbbbbbb';

const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
  keywords: ['productivity', 'excuses', 'fun'],
});

const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId, {
  keywords: ['productivity', 'excuses', 'fun'],
});

export function useAds() {
  const { hasPremiumAccess, addCredits } = useMonetizationStore();
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [rewardedLoaded, setRewardedLoaded] = useState(false);

  useEffect(() => {
    // Pro users never load or see ads
    if (hasPremiumAccess()) return;

    const unsubscribeInterstitialLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setInterstitialLoaded(true);
    });

    const unsubscribeInterstitialClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setInterstitialLoaded(false);
      interstitial.load(); // preload next
    });

    const unsubscribeRewardedLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setRewardedLoaded(true);
    });

    const unsubscribeRewardedEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        // Award 2 bonus credits when they watch an ad
        addCredits(2);
      },
    );

    const unsubscribeRewardedClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      setRewardedLoaded(false);
      rewarded.load(); // preload next
    });

    // Start loading
    interstitial.load();
    rewarded.load();

    return () => {
      unsubscribeInterstitialLoaded();
      unsubscribeInterstitialClosed();
      unsubscribeRewardedLoaded();
      unsubscribeRewardedEarned();
      unsubscribeRewardedClosed();
    };
  }, [hasPremiumAccess, addCredits]);

  const showInterstitial = () => {
    if (hasPremiumAccess()) return;
    if (interstitialLoaded) {
      interstitial.show();
    }
  };

  const showRewarded = () => {
    if (hasPremiumAccess()) return;
    if (rewardedLoaded) {
      rewarded.show();
    }
  };

  return {
    interstitialLoaded,
    rewardedLoaded,
    showInterstitial,
    showRewarded
  };
}
