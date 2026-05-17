import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Share from 'react-native-share';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { useUserStore } from '../../../stores/userStore';
import { useMonetizationStore } from '../../../stores/monetizationStore';
import { generateReferralCode, applyReferralCode, initializeUserReferral } from '../../../core/services/referral';
import { Button } from '../../../shared/components';

export function ReferralScreen() {
  const navigation = useNavigation();
  const { username } = useUserStore();
  const { addCredits } = useMonetizationStore();
  
  const [referralCode, setReferralCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (username) {
      const code = generateReferralCode(username);
      setReferralCode(code);
      // Fire and forget init
      initializeUserReferral(username, code);
    }
  }, [username]);

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.open({
        title: 'Get 5 Free Excuses on OFFHOOK!',
        message: `Need a flawless excuse? Download OFFHOOK and use my referral code ${referralCode} to get 5 free premium excuses instantly!`,
        url: 'https://offhook.app/download',
      });
    } catch (error) {
      console.log('Share dismissed or failed', error);
    }
  };

  const handleApplyCode = async () => {
    if (!inputCode.trim()) {
      Alert.alert('Missing Code', 'Please enter a valid referral code.');
      return;
    }

    if (!username) {
      Alert.alert('Error', 'You must be logged in to use a referral code.');
      return;
    }

    setIsSubmitting(true);
    const result = await applyReferralCode(inputCode, username);
    setIsSubmitting(false);

    if (result.success && result.bonusCredits) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addCredits(result.bonusCredits);
      Alert.alert('Success!', `You've received ${result.bonusCredits} free credits!`);
      setInputCode('');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Referral Failed', result.message || 'Could not apply this code.');
    }
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
            <Text style={styles.title}>Refer a Friend</Text>
          </View>
          
          {/* Share Your Code Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Share your code</Text>
            <Text style={styles.cardDesc}>
              Give your friends 5 free excuses. When they sign up using your code, you'll BOTH get 5 credits!
            </Text>
            
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{referralCode || '------'}</Text>
            </View>
            
            <Button 
              title="Share Code" 
              onPress={handleShare} 
              variant="primary" 
              fullWidth 
            />
          </View>

          {/* Enter a Code Section */}
          <View style={[styles.card, { marginTop: Spacing.xl }]}>
            <Text style={styles.cardTitle}>Have a referral code?</Text>
            <Text style={styles.cardDesc}>
              Enter a friend's code below to claim your 5 free credits.
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter code here"
              placeholderTextColor={Colors.textMuted}
              value={inputCode}
              onChangeText={setInputCode}
              autoCapitalize="characters"
              maxLength={10}
            />
            
            {isSubmitting ? (
              <ActivityIndicator color={Colors.accent1} size="large" style={{ marginTop: 20 }} />
            ) : (
              <Button 
                title="Redeem Code" 
                onPress={handleApplyCode} 
                variant="outline" 
                fullWidth 
              />
            )}
          </View>

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
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardTitle: {
    ...Typography.headlineSmall,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  cardDesc: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  codeBox: {
    backgroundColor: 'rgba(0, 255, 204, 0.1)',
    borderWidth: 1,
    borderColor: Colors.accent1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  codeText: {
    ...Typography.headlineMedium,
    color: Colors.accent1,
    fontWeight: '900',
    letterSpacing: 4,
  },
  input: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    color: Colors.textPrimary,
    ...Typography.headlineSmall,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: Spacing.lg,
  },
});
