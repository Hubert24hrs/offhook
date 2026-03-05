// OFFHOOK — Location Service
// Real GPS via expo-location with caching

import * as Location from 'expo-location';

export interface LocationData {
    city: string;
    country: string;
    neighborhood?: string;
    coords: {
        latitude: number;
        longitude: number;
    };
}

let cachedLocation: LocationData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const MOCK_LOCATION: LocationData = {
    city: 'Lagos',
    country: 'Nigeria',
    neighborhood: 'Lekki',
    coords: { latitude: 6.4541, longitude: 3.4206 },
};

export async function requestLocationPermission(): Promise<boolean> {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.warn('Location permission error:', error);
        return false;
    }
}

export async function getCurrentLocation(): Promise<LocationData> {
    // Return cache if fresh
    if (cachedLocation && Date.now() - lastFetchTime < CACHE_DURATION) {
        return cachedLocation;
    }

    try {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            return MOCK_LOCATION;
        }

        const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });

        const [reverseGeocode] = await Location.reverseGeocodeAsync({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });

        const locationData: LocationData = {
            city: reverseGeocode?.city || reverseGeocode?.subregion || 'Unknown',
            country: reverseGeocode?.country || 'Unknown',
            neighborhood: reverseGeocode?.district || reverseGeocode?.street || undefined,
            coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            },
        };

        cachedLocation = locationData;
        lastFetchTime = Date.now();

        return locationData;
    } catch (error) {
        console.warn('Location fetch error, using mock:', error);
        return MOCK_LOCATION;
    }
}

export function getCachedLocation(): LocationData {
    return cachedLocation || MOCK_LOCATION;
}
