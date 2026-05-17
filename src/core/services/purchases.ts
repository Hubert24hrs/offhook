// OFFHOOK — RevenueCat Purchases Service
// Wraps react-native-purchases for in-app subscriptions
// Replace placeholder SDK keys with real RevenueCat API keys from https://app.revenuecat.com

import Purchases, {
    type PurchasesPackage,
    type CustomerInfo,
    LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// ─── RevenueCat SDK Keys ───────────────────────────────────────────────────
// Set these in your .env file or EAS secrets:
//   EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxx
//   EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxx
const RC_IOS_KEY =
    (process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY as string) ?? '';
const RC_ANDROID_KEY =
    (process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY as string) ?? '';

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
    error?: string;
}

// Track whether the SDK has been successfully configured
let isConfigured = false;

// ─── Initialization ─────────────────────────────────────────────────────────

export async function initializePurchases(userId?: string): Promise<void> {
    const apiKey = Platform.OS === 'ios' ? RC_IOS_KEY : RC_ANDROID_KEY;

    if (!apiKey || apiKey.length < 5) {
        // RevenueCat not configured — run in demo mode
        return;
    }

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

export async function getOfferings(): Promise<PurchasePackage[]> {
    if (!isConfigured) {
        throw new Error('No offerings available — RevenueCat not configured');
    }

    try {
        const offerings = await Purchases.getOfferings();
        const current = offerings.current;

        if (!current || current.availablePackages.length === 0) {
            throw new Error('No offerings available');
        }

        return current.availablePackages.map(mapPackage);
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch offerings');
    }
}

// ─── Purchase ──────────────────────────────────────────────────────────────

export async function purchasePackage(packageId: string): Promise<PurchaseResult> {
    if (!isConfigured) {
        return {
            success: false,
            isPro: false,
            error: 'No offerings available — RevenueCat not configured',
        };
    }

    try {
        const offerings = await Purchases.getOfferings();
        const current = offerings.current;

        if (!current) {
            return { success: false, isPro: false, error: 'No offerings available' };
        }

        const pkg: PurchasesPackage | undefined = current.availablePackages.find(
            (p) => p.identifier === packageId || p.product.identifier === packageId
        );

        if (!pkg) {
            return { success: false, isPro: false, error: 'Package not found' };
        }

        const { customerInfo } = await Purchases.purchasePackage(pkg);
        const isPro = checkProEntitlement(customerInfo);

        return { success: true, isPro };
    } catch (error: any) {
        // User cancelled — not an error we surface
        if (
            error?.code === 1 ||
            error?.message?.toLowerCase().includes('cancel') ||
            error?.userCancelled
        ) {
            return { success: false, isPro: false, error: 'Purchase cancelled' };
        }
        return {
            success: false,
            isPro: false,
            error: error?.message || 'Purchase failed. Please try again.',
        };
    }
}

// ─── Restore ───────────────────────────────────────────────────────────────

export async function restorePurchases(): Promise<PurchaseResult> {
    if (!isConfigured) {
        return {
            success: false,
            isPro: false,
            error: 'RevenueCat not configured',
        };
    }

    try {
        const customerInfo = await Purchases.restorePurchases();
        const isPro = checkProEntitlement(customerInfo);
        return { success: true, isPro };
    } catch (error: any) {
        return {
            success: false,
            isPro: false,
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

function checkProEntitlement(customerInfo: CustomerInfo): boolean {
    // Check for active entitlement named "pro" or "premium"
    const entitlements = customerInfo.entitlements.active;
    return 'pro' in entitlements || 'premium' in entitlements;
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
