import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { usePurchases } from '../../../hooks/usePurchases';

export function TipJarScreen() {
  const navigation = useNavigation();
  const { offerings, isReady, isPurchasing, purchase } = usePurchases();
  const confettiRef = useRef<any>(null);

  const handleTip = async (packId: string) => {
    const pkg = offerings?.tips.find(p => p.productIdentifier.includes(packId));
    if (!pkg) return;

    const success = await purchase(pkg);
    if (success) {
      confettiRef.current?.start();
    }
  };

  const getTipDetails = (identifier: string) => {
    if (identifier.includes('tip_coffee')) return { icon: '☕', title: 'Buy us a coffee' };
    if (identifier.includes('tip_beer')) return { icon: '🍺', title: 'Buy us a beer' };
    if (identifier.includes('tip_lunch')) return { icon: '🍔', title: 'Buy us lunch' };
    return { icon: '💸', title: 'Tip' };
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
            <Text style={styles.title}>Tip Jar</Text>
          </View>
          
          <View style={styles.iconContainer}>
            <Text style={styles.mainIcon}>💖</Text>
          </View>
          
          <Text style={styles.subtitle}>
            If OFFHOOK saved your bacon today, consider dropping a tip to support development!
          </Text>

          {!isReady ? (
            <ActivityIndicator color={Colors.accent1} size="large" style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.packGrid}>
              {offerings?.tips.map((pkg, index) => {
                const details = getTipDetails(pkg.productIdentifier);
                
                return (
                  <Animated.View 
                    key={pkg.productIdentifier} 
                    entering={FadeInDown.delay(100 + index * 100).springify()}
                  >
                    <TouchableOpacity
                      disabled={isPurchasing}
                      onPress={() => handleTip(pkg.productIdentifier)}
                      style={styles.packCard}
                    >
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

      {/* Confetti Explosion */}
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        fadeOut={true}
      />
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
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  mainIcon: {
    fontSize: 64,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.md,
    lineHeight: 22,
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
  packIcon: {
    fontSize: 28,
    marginRight: Spacing.md,
  },
  packTitle: {
    flex: 1,
    ...Typography.headlineSmall,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  packPrice: {
    ...Typography.headlineSmall,
    color: Colors.accent2,
    fontWeight: '800',
  },
});
