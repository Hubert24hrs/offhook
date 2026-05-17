/**
 * OFFHOOK Analytics Service
 * 
 * Placeholder wrapper for PostHog or Mixpanel to track primary conversion funnels.
 * Once a provider is selected, implement the actual SDK calls inside these methods.
 */

export const Analytics = {
  /**
   * Initialize the analytics SDK
   */
  init: () => {
    // PostHog.setup('API_KEY', { host: 'https://app.posthog.com' });
    console.log('[Analytics] Initialized');
  },

  /**
   * Identify a user to link events to their profile
   */
  identify: (userId: string, traits?: Record<string, any>) => {
    console.log(`[Analytics] Identify: ${userId}`, traits);
  },

  /**
   * Track when the paywall is shown to the user
   */
  trackPaywallShown: (triggerSource: string) => {
    console.log('[Analytics] Event: Paywall Shown', { source: triggerSource });
    // mixpanel.track('Paywall Shown', { source: triggerSource });
  },

  /**
   * Track when a user successfully completes a purchase or subscription
   */
  trackPurchaseSuccess: (productId: string, price?: number, currency?: string) => {
    console.log('[Analytics] Event: Purchase Success', { productId, price, currency });
  },

  /**
   * Track when a user cancels or fails a purchase
   */
  trackPurchaseFailed: (productId: string, error?: string) => {
    console.log('[Analytics] Event: Purchase Failed', { productId, error });
  },

  /**
   * Track when an interstitial or rewarded ad is viewed
   */
  trackAdViewed: (adType: 'interstitial' | 'rewarded', network: 'admob' = 'admob') => {
    console.log('[Analytics] Event: Ad Viewed', { adType, network });
  },

  /**
   * Track when a referral code is shared
   */
  trackReferralShared: (code: string) => {
    console.log('[Analytics] Event: Referral Shared', { code });
  },

  /**
   * Track when a referral code is successfully applied
   */
  trackReferralApplied: (code: string, bonusCredits: number) => {
    console.log('[Analytics] Event: Referral Applied', { code, bonusCredits });
  },

  /**
   * Track when a feature is blocked by the premium gate
   */
  trackPremiumGateHit: (featureName: string) => {
    console.log('[Analytics] Event: Premium Gate Hit', { feature: featureName });
  }
};
