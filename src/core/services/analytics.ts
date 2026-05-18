import PostHog from 'posthog-react-native';

let posthog: PostHog | null = null;

export const Analytics = {
  /**
   * Initialize the analytics SDK
   */
  init: async () => {
    try {
      posthog = await PostHog.initAsync(process.env.EXPO_PUBLIC_POSTHOG_API_KEY || 'phc_PLACEHOLDER_KEY', {
        host: 'https://app.posthog.com',
      });
      console.log('[Analytics] Initialized with PostHog');
    } catch (error) {
      console.warn('[Analytics] Failed to initialize PostHog', error);
    }
  },

  /**
   * Identify a user to link events to their profile
   */
  identify: (userId: string, traits?: Record<string, any>) => {
    console.log(`[Analytics] Identify: ${userId}`, traits);
    if (posthog) {
      posthog.identify(userId, traits);
    }
  },

  /**
   * Track when the paywall is shown to the user
   */
  trackPaywallShown: (triggerSource: string) => {
    console.log('[Analytics] Event: Paywall Shown', { source: triggerSource });
    if (posthog) {
      posthog.capture('Paywall Shown', { source: triggerSource });
    }
  },

  /**
   * Track when a user successfully completes a purchase or subscription
   */
  trackPurchaseSuccess: (productId: string, price?: number, currency?: string) => {
    console.log('[Analytics] Event: Purchase Success', { productId, price, currency });
    if (posthog) {
      posthog.capture('Purchase Success', { productId, price, currency });
    }
  },

  /**
   * Track when a user cancels or fails a purchase
   */
  trackPurchaseFailed: (productId: string, error?: string) => {
    console.log('[Analytics] Event: Purchase Failed', { productId, error });
    if (posthog) {
      posthog.capture('Purchase Failed', { productId, error });
    }
  },

  /**
   * Track when an interstitial or rewarded ad is viewed
   */
  trackAdViewed: (adType: 'interstitial' | 'rewarded', network: 'admob' = 'admob') => {
    console.log('[Analytics] Event: Ad Viewed', { adType, network });
    if (posthog) {
      posthog.capture('Ad Viewed', { adType, network });
    }
  },

  /**
   * Track when a referral code is shared
   */
  trackReferralShared: (code: string) => {
    console.log('[Analytics] Event: Referral Shared', { code });
    if (posthog) {
      posthog.capture('Referral Shared', { code });
    }
  },

  /**
   * Track when a referral code is successfully applied
   */
  trackReferralApplied: (code: string, bonusCredits: number) => {
    console.log('[Analytics] Event: Referral Applied', { code, bonusCredits });
    if (posthog) {
      posthog.capture('Referral Applied', { code, bonusCredits });
    }
  },

  /**
   * Track when a feature is blocked by the premium gate
   */
  trackPremiumGateHit: (featureName: string) => {
    console.log('[Analytics] Event: Premium Gate Hit', { feature: featureName });
    if (posthog) {
      posthog.capture('Premium Gate Hit', { feature: featureName });
    }
  },

  /**
   * Track when an excuse is generated
   */
  trackExcuseGenerated: (category: string, tone: string, riskScore: number) => {
    console.log('[Analytics] Event: Excuse Generated', { category, tone, riskScore });
    if (posthog) {
      posthog.capture('Excuse Generated', { category, tone, riskScore });
    }
  },

  /**
   * Track when an excuse is shared
   */
  trackExcuseShared: (category: string, method: string) => {
    console.log('[Analytics] Event: Excuse Shared', { category, method });
    if (posthog) {
      posthog.capture('Excuse Shared', { category, method });
    }
  }
};
