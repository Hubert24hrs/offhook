// OFFHOOK — RevenueCat Purchases Service
// Wraps react-native-purchases for in-app subscriptions, lifetime, credits, and tips.

import Purchases, {
    type PurchasesPackage,
    type CustomerInfo,
    type PurchasesOfferings,
    LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// ─── RevenueCat SDK Keys ───────────────────────────────────────────────────
const RC_IOS_KEY = (process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY as string) ?? '';
const RC_ANDROID_KEY = (process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY as string) ?? '';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PurchasePackage {
    identifier: string;
    productIdentifier: string;
    packageType: string;
    product: {
        identifier: string;
        description: string;
        title: string;
        price: number;
        priceString: string;
        currencyCode: string;
    };
}

export interface PurchaseResult {
    success: boolean;
    isPro: boolean;
    isLifetime: boolean;
    customerInfo?: CustomerInfo;
    error?: string;
    purchasedProductIdentifier?: string;
}

export interface OffhookOfferings {
    subscriptions: PurchasePackage[];
    lifetime: PurchasePackage | null;
    credits: PurchasePackage[];
    tips: PurchasePackage[];
}

let isConfigured = false;

// ─── Initialization ─────────────────────────────────────────────────────────

export async function initializePurchases(userId?: string): Promise<void> {
    const apiKey = Platform.OS === 'ios' ? RC_IOS_KEY : RC_ANDROID_KEY;

    if (!apiKey || apiKey.length < 5) return;

    try {
        if (__DEV__) {
            await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        }

        await Purchases.configure({ apiKey, appUserID: userId || null });
        isConfigured = true;
    } catch (error) {
        // Silently fail — app works in demo mode
    }
}

// ─── Offerings ─────────────────────────────────────────────────────────────

export async function getOfferings(): Promise<OffhookOfferings> {
    if (!isConfigured) {
        throw new Error('No offerings available — RevenueCat not configured');
    }

    try {
        const offerings = await Purchases.getOfferings();
        
        // Assuming your RevenueCat has custom offerings for different product types, 
        // or they are all bundled in 'current'. We will filter based on identifier.
        // For standard setup, subscriptions are in current, others might be in custom offerings.
        const current = offerings.current;
        if (!current) throw new Error('No offerings available');

        const allPackages = current.availablePackages.map(mapPackage);

        // Filter based on expected product identifiers (as defined in plan)
        const subscriptions = allPackages.filter(p => 
            p.productIdentifier.includes('pro_monthly') || p.productIdentifier.includes('pro_annual')
        );
        const lifetime = allPackages.find(p => p.productIdentifier.includes('lifetime')) || null;
        
        // If credits/tips are in different offerings in RevenueCat dashboard:
        const creditOffering = offerings.all['credits']?.availablePackages.map(mapPackage) || [];
        const tipsOffering = offerings.all['tips']?.availablePackages.map(mapPackage) || [];

        return {
            subscriptions: subscriptions.length > 0 ? subscriptions : allPackages, // Fallback if naming differs
            lifetime,
            credits: creditOffering,
            tips: tipsOffering
        };
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch offerings');
    }
}

// ─── Purchase ──────────────────────────────────────────────────────────────

export async function purchasePackage(pkgToBuy: PurchasePackage): Promise<PurchaseResult> {
    if (!isConfigured) {
        return { success: false, isPro: false, isLifetime: false, error: 'RevenueCat not configured' };
    }

    try {
        // Need to pass the original PurchasesPackage object. 
        // Fetch it again quickly to guarantee we have the SDK object.
        const offerings = await Purchases.getOfferings();
        let sdkPackage: PurchasesPackage | undefined;
        
        // Scan all offerings to find the exact package object
        Object.values(offerings.all).forEach(offering => {
            const found = offering.availablePackages.find(p => p.identifier === pkgToBuy.identifier);
            if (found) sdkPackage = found;
        });

        if (!sdkPackage) {
            return { success: false, isPro: false, isLifetime: false, error: 'Package not found in SDK' };
        }

        const { customerInfo } = await Purchases.purchasePackage(sdkPackage);
        
        return { 
            success: true, 
            isPro: checkProEntitlement(customerInfo),
            isLifetime: checkLifetimeEntitlement(customerInfo),
            customerInfo,
            purchasedProductIdentifier: sdkPackage.product.identifier
        };
    } catch (error: any) {
        if (error?.userCancelled) {
            return { success: false, isPro: false, isLifetime: false, error: 'Purchase cancelled' };
        }
        return {
            success: false,
            isPro: false,
            isLifetime: false,
            error: error?.message || 'Purchase failed. Please try again.',
        };
    }
}

// ─── Restore ───────────────────────────────────────────────────────────────

export async function restorePurchases(): Promise<PurchaseResult> {
    if (!isConfigured) {
        return { success: false, isPro: false, isLifetime: false, error: 'RevenueCat not configured' };
    }

    try {
        const customerInfo = await Purchases.restorePurchases();
        return { 
            success: true, 
            isPro: checkProEntitlement(customerInfo),
            isLifetime: checkLifetimeEntitlement(customerInfo),
            customerInfo
        };
    } catch (error: any) {
        return {
            success: false,
            isPro: false,
            isLifetime: false,
            error: error?.message || 'Restore failed. Please try again.',
        };
    }
}

// ─── Customer Info ──────────────────────────────────────────────────────────

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
    if (!isConfigured) return null;

    try {
        return await Purchases.getCustomerInfo();
    } catch {
        return null;
    }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

export function checkProEntitlement(customerInfo: CustomerInfo | null): boolean {
    if (!customerInfo) return false;
    const entitlements = customerInfo.entitlements.active;
    return 'pro' in entitlements || 'premium' in entitlements;
}

export function checkLifetimeEntitlement(customerInfo: CustomerInfo | null): boolean {
    if (!customerInfo) return false;
    const entitlements = customerInfo.entitlements.active;
    return 'lifetime' in entitlements;
}

function mapPackage(pkg: PurchasesPackage): PurchasePackage {
    return {
        identifier: pkg.identifier,
        productIdentifier: pkg.product.identifier,
        packageType: pkg.packageType,
        product: {
            identifier: pkg.product.identifier,
            description: pkg.product.description,
            title: pkg.product.title,
            price: pkg.product.price,
            priceString: pkg.product.priceString,
            currencyCode: pkg.product.currencyCode,
        },
    };
}
