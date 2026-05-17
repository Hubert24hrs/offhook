import React from 'react';
import { View, TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { useMonetizationStore } from '../../../stores/monetizationStore';
import { Analytics } from '../../../core/services/analytics';

interface PremiumGateProps {
  children: React.ReactNode;
  featureName: string;
  fallback?: React.ReactNode;
  style?: ViewStyle;
}

export function PremiumGate({ children, featureName, fallback, style }: PremiumGateProps) {
  const { hasPremiumAccess, setPaywallVisible } = useMonetizationStore();
  const isPro = hasPremiumAccess();

  const handleIntercept = () => {
    Analytics.trackPremiumGateHit(featureName);
    setPaywallVisible(true);
  };

  if (isPro) {
    return <View style={style}>{children}</View>;
  }

  if (fallback) {
    return <View style={style}>{fallback}</View>;
  }

  return (
    <View style={style}>
      <View pointerEvents="none" style={{ opacity: 0.5 }}>
        {children}
      </View>
      <TouchableOpacity 
        style={StyleSheet.absoluteFill} 
        onPress={handleIntercept} 
        activeOpacity={0.8}
      />
    </View>
  );
}
