import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { usePurchases } from '../../../hooks/usePurchases';
import { useMonetizationStore } from '../../../stores/monetizationStore';

export function CreditPackScreen() {
  const navigation = useNavigation();
  const { offerings, isReady, isPurchasing, purchase } = usePurchases();
  const { creditBalance } = useMonetizationStore();

  const handleBuyPack = async (packId: string) => {
    const pkg = offerings?.consumables.find(p => p.productIdentifier.includes(packId));
    if (!pkg) return;
    
    const success = await purchase(pkg);
    if (success) {
      // Confetti could be fired here or navigation.goBack()
      navigation.goBack();
    }
  };

  const getPackDetails = (identifier: string) => {
    if (identifier.includes('pack_10')) return { icon: '🪙', title: '10 Excuses', extra: '' };
    if (identifier.includes('pack_50')) return { icon: '💰', title: '50 Excuses', extra: 'Most Popular' };
    if (identifier.includes('pack_200')) return { icon: '💎', title: '200 Excuses', extra: 'Best Value' };
    return { icon: '🎫', title: 'Credit Pack', extra: '' };
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A1A', '#12122A']} style={StyleSheet.absoluteFill} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.springify()}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Get More Excuses</Text>
          </View>
          
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>🪙 {creditBalance} Credits</Text>
          </View>
          
          <Text style={styles.subtitle}>
            Don't want a subscription? Buy an excuse pack instead. Credits never expire.
          </Text>

          {!isReady ? (
            <ActivityIndicator color={Colors.accent1} size="large" style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.packGrid}>
              {offerings?.consumables.map((pkg, index) => {
                const details = getPackDetails(pkg.productIdentifier);
                const isPopular = details.extra === 'Most Popular';
                
                return (
                  <Animated.View 
                    key={pkg.productIdentifier} 
                    entering={FadeInDown.delay(100 + index * 100).springify()}
                  >
                    <TouchableOpacity
                      disabled={isPurchasing}
                      onPress={() => handleBuyPack(pkg.productIdentifier)}
                      style={[styles.packCard, isPopular && styles.packCardPopular]}
                    >
                      {isPopular && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularBadgeText}>{details.extra}</Text>
                        </View>
                      )}
                      
                      <Text style={styles.packIcon}>{details.icon}</Text>
                      <Text style={styles.packTitle}>{details.title}</Text>
                      <Text style={styles.packPrice}>{pkg.product.priceString}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    ...Typography.headlineMedium,
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  balanceLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  balanceAmount: {
    ...Typography.displaySmall,
    color: Colors.accent1,
    fontWeight: 'bold',
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.md,
  },
  packGrid: {
    gap: Spacing.md,
  },
  packCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  packCardPopular: {
    borderColor: Colors.accent1,
    backgroundColor: 'rgba(0, 255, 204, 0.05)',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: Colors.accent1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    ...Typography.caption,
    color: '#000',
    fontWeight: 'bold',
  },
  packIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  packTitle: {
    flex: 1,
    ...Typography.headlineSmall,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  packPrice: {
    ...Typography.headlineSmall,
    color: Colors.textPrimary,
    fontWeight: '800',
  },
});
