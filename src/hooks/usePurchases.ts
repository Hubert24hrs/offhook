import { useEffect, useState } from 'react';
import { useMonetizationStore } from '../stores/monetizationStore';
import * as PurchasesService from '../core/services/purchases';
import { PurchasePackage, PurchaseResult, OffhookOfferings } from '../core/services/purchases';
import { Alert } from 'react-native';

export function usePurchases() {
  const { 
    setIsPro, 
    setLifetimeUnlocked, 
    addCredits 
  } = useMonetizationStore();

  const [offerings, setOfferings] = useState<OffhookOfferings | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Initialize and load offerings
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        await PurchasesService.initializePurchases(); // safe to call multiple times
        const info = await PurchasesService.getCustomerInfo();
        
        if (mounted && info) {
          setIsPro(PurchasesService.checkProEntitlement(info));
          setLifetimeUnlocked(PurchasesService.checkLifetimeEntitlement(info));
        }

        const offs = await PurchasesService.getOfferings();
        if (mounted) {
          setOfferings(offs);
          setIsReady(true);
        }
      } catch (error) {
        console.warn('Failed to load purchases', error);
        if (mounted) setIsReady(true); // Don't block UI forever
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [setIsPro, setLifetimeUnlocked]);

  // Handle purchases
  const purchase = async (pkg: PurchasePackage): Promise<boolean> => {
    if (isPurchasing) return false;
    setIsPurchasing(true);
    
    try {
      const result: PurchaseResult = await PurchasesService.purchasePackage(pkg);
      
      if (result.success) {
        setIsPro(result.isPro);
        setLifetimeUnlocked(result.isLifetime);

        // Handle Consumables logic
        if (pkg.productIdentifier.includes('pack_10')) addCredits(10);
        else if (pkg.productIdentifier.includes('pack_50')) addCredits(50);
        else if (pkg.productIdentifier.includes('pack_200')) addCredits(200);

        // (Tips are consumed, but we just trigger confetti UI from the component)
        return true;
      } else if (result.error !== 'Purchase cancelled') {
        Alert.alert('Purchase Failed', result.error);
      }
      return false;
    } finally {
      setIsPurchasing(false);
    }
  };

  const restore = async (): Promise<boolean> => {
    if (isPurchasing) return false;
    setIsPurchasing(true);

    try {
      const result = await PurchasesService.restorePurchases();
      if (result.success) {
        setIsPro(result.isPro);
        setLifetimeUnlocked(result.isLifetime);
        return true;
      } else {
        Alert.alert('Restore Failed', result.error || 'Failed to restore purchases.');
        return false;
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  return {
    isReady,
    isPurchasing,
    offerings,
    purchase,
    restore
  };
}
