import React, { useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView 
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { 
  FadeInDown, 
  FadeInUp 
} from 'react-native-reanimated';
import { useMonetizationStore } from '../../../stores/monetizationStore';
import { usePurchases } from '../../../hooks/usePurchases';
import { PurchasePackage } from '../../../core/services/purchases';
import { Analytics } from '../../../core/services/analytics';

const FEATURES = [
  '♾️ Unlimited AI Excuses',
  '📂 Access All Categories',
  '🕵️ Alibi Builder',
  '📸 Fake Proof Generator',
  '⚠️ Advanced Risk Meter',
  '⏱️ Priority AI Response'
];

export function PaywallSheet() {
  const { isPaywallVisible, setPaywallVisible } = useMonetizationStore();
  const { isReady, isPurchasing, offerings, purchase, restore } = usePurchases();

  // Find exact packages if available
  const monthlyPkg = offerings?.subscriptions.find(p => p.productIdentifier.includes('monthly'));
  const annualPkg = offerings?.subscriptions.find(p => p.productIdentifier.includes('annual'));
  const lifetimePkg = offerings?.lifetime;

  const handlePurchase = async (pkg: PurchasePackage) => {
    const success = await purchase(pkg);
    if (success) {
      Analytics.trackPurchaseSuccess(pkg.productIdentifier, pkg.product.price, pkg.product.currencyCode);
      setPaywallVisible(false);
    } else {
      Analytics.trackPurchaseFailed(pkg.productIdentifier);
    }
  };

  const handleRestore = async () => {
    const success = await restore();
    if (success) {
      setPaywallVisible(false);
    }
  };

  if (!isPaywallVisible) return null;

  return (
    <Modal
      visible={isPaywallVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setPaywallVisible(false)}
    >
      <View style={styles.overlay}>
        <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
          <TouchableOpacity 
            style={styles.closeArea} 
            activeOpacity={1} 
            onPress={() => setPaywallVisible(false)} 
          />
          
          <Animated.View 
            entering={FadeInDown.duration(400).springify()} 
            style={styles.sheet}
          >
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setPaywallVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Unlock OFFHOOK Pro</Text>
            <Text style={styles.subtitle}>Get out of anything, anytime.</Text>

            <ScrollView style={styles.featuresList} showsVerticalScrollIndicator={false}>
              {FEATURES.map((feature, idx) => (
                <Animated.View 
                  key={feature} 
                  entering={FadeInUp.delay(idx * 100).duration(400)}
                  style={styles.featureItem}
                >
                  <Text style={styles.featureText}>{feature}</Text>
                </Animated.View>
              ))}
            </ScrollView>

            <View style={styles.packagesContainer}>
              {!isReady ? (
                <ActivityIndicator size="large" color="#00ffcc" />
              ) : (
                <>
                  {/* Annual Package - Highlighted */}
                  {annualPkg && (
                    <TouchableOpacity 
                      style={[styles.packageButton, styles.packageButtonHighlight]}
                      onPress={() => handlePurchase(annualPkg)}
                      disabled={isPurchasing}
                    >
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>Save 50%</Text>
                      </View>
                      <View>
                        <Text style={styles.packageTitle}>Yearly Pro</Text>
                        <Text style={styles.packageSubtitle}>3-day free trial</Text>
                      </View>
                      <Text style={styles.packagePrice}>{annualPkg.product.priceString}</Text>
                    </TouchableOpacity>
                  )}

                  {/* Monthly Package */}
                  {monthlyPkg && (
                    <TouchableOpacity 
                      style={styles.packageButton}
                      onPress={() => handlePurchase(monthlyPkg)}
                      disabled={isPurchasing}
                    >
                      <Text style={styles.packageTitle}>Monthly Pro</Text>
                      <Text style={styles.packagePrice}>{monthlyPkg.product.priceString}</Text>
                    </TouchableOpacity>
                  )}

                  {/* Lifetime Package */}
                  {lifetimePkg && (
                    <TouchableOpacity 
                      style={styles.packageButton}
                      onPress={() => handlePurchase(lifetimePkg)}
                      disabled={isPurchasing}
                    >
                      <View>
                        <Text style={styles.packageTitle}>Lifetime Unlock</Text>
                        <Text style={styles.packageSubtitle}>Pay once, use forever</Text>
                      </View>
                      <Text style={styles.packagePrice}>{lifetimePkg.product.priceString}</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>

            <View style={styles.footer}>
              <TouchableOpacity onPress={handleRestore} disabled={isPurchasing}>
                <Text style={styles.footerLink}>Restore Purchases</Text>
              </TouchableOpacity>
              <Text style={styles.footerLinkText}> • </Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Terms</Text>
              </TouchableOpacity>
              <Text style={styles.footerLinkText}> • </Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Privacy</Text>
              </TouchableOpacity>
            </View>
            
          </Animated.View>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  closeArea: {
    flex: 1,
  },
  sheet: {
    backgroundColor: 'rgba(20, 20, 30, 0.95)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingTop: 32,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 24,
    textAlign: 'center',
  },
  featuresList: {
    marginBottom: 24,
    maxHeight: 200,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#eee',
    fontWeight: '600',
  },
  packagesContainer: {
    gap: 12,
    marginBottom: 24,
  },
  packageButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  packageButtonHighlight: {
    backgroundColor: 'rgba(0, 255, 204, 0.1)',
    borderColor: '#00ffcc',
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#00ffcc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  packageSubtitle: {
    fontSize: 12,
    color: '#00ffcc',
    marginTop: 4,
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerLink: {
    color: '#666',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  footerLinkText: {
    color: '#666',
    fontSize: 12,
    marginHorizontal: 8,
  }
});
