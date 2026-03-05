// OFFHOOK — Context Builder Service
// Merges location, weather, time, and history into ExcuseContext

import { getCurrentLocation } from './location';
import { getWeather } from './weather';
import { historyManager } from '../ai';
import type { ExcuseContext } from '../ai';

export async function buildRealContext(overrides: {
    contactName: string;
    relationship: string;
    tone: string;
    situationType: string;
    urgency: string;
    category: string;
    contactId?: string;
}): Promise<ExcuseContext> {
    // Gather real-world context
    const location = await getCurrentLocation();
    const weather = await getWeather(location.coords.latitude, location.coords.longitude);

    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Get excuse history for anti-repetition
    const contactId = overrides.contactId || overrides.contactName;
    const recentExcuses = historyManager.getExcusesForContact(contactId);
    const excuseHistory = recentExcuses.slice(0, 10).map(e => e.excuseText);
    const usedThemes = historyManager.getUsedThemes(30);

    // Determine cultural region from country
    const culturalRegion = getCulturalRegion(location.country);

    return {
        location: {
            city: location.city,
            country: location.country,
            neighborhood: location.neighborhood,
        },
        weather: {
            condition: weather.condition,
            temperature: weather.temperature,
            description: weather.description,
        },
        currentTime,
        dayOfWeek,
        contactName: overrides.contactName,
        relationship: overrides.relationship,
        excuseHistory,
        usedThemes,
        culturalRegion,
        tone: overrides.tone,
        situationType: overrides.situationType,
        urgency: overrides.urgency,
        category: overrides.category,
    };
}

function getCulturalRegion(country: string): string {
    const regionMap: Record<string, string> = {
        'Nigeria': 'West Africa',
        'Ghana': 'West Africa',
        'Kenya': 'East Africa',
        'South Africa': 'Southern Africa',
        'United States': 'North America',
        'Canada': 'North America',
        'United Kingdom': 'Western Europe',
        'Germany': 'Western Europe',
        'France': 'Western Europe',
        'India': 'South Asia',
        'Japan': 'East Asia',
        'Brazil': 'South America',
        'Australia': 'Oceania',
    };
    return regionMap[country] || 'Global';
}
