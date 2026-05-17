// OFFHOOK — Weather Service
// Uses Open-Meteo API (https://open-meteo.com) — FREE, no API key required
// WMO weather interpretation codes: https://open-meteo.com/en/docs#weathervariables

export interface WeatherData {
    condition: string;
    temperature: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
}

let cachedWeather: WeatherData | null = null;
let lastWeatherFetch = 0;
const WEATHER_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const MOCK_WEATHER: WeatherData = {
    condition: 'Partly Cloudy',
    temperature: 24,
    description: 'Warm with scattered clouds',
    icon: '🌤️',
    humidity: 65,
    windSpeed: 12,
};

// ─── WMO Weather Code → Condition + Icon ──────────────────────────────────

interface WMOInfo {
    condition: string;
    description: string;
    icon: string;
}

function wmoCodeToInfo(code: number): WMOInfo {
    if (code === 0)  return { condition: 'Clear',              description: 'Clear sky',                     icon: '☀️'  };
    if (code === 1)  return { condition: 'Mostly Clear',       description: 'Mainly clear',                  icon: '🌤️' };
    if (code === 2)  return { condition: 'Partly Cloudy',      description: 'Partly cloudy',                 icon: '⛅'  };
    if (code === 3)  return { condition: 'Overcast',           description: 'Overcast',                      icon: '☁️'  };
    if (code === 45) return { condition: 'Foggy',              description: 'Depositing rime fog',           icon: '🌫️' };
    if (code === 48) return { condition: 'Foggy',              description: 'Icy fog',                       icon: '🌫️' };
    if (code === 51) return { condition: 'Light Drizzle',      description: 'Light drizzle',                 icon: '🌦️' };
    if (code === 53) return { condition: 'Drizzle',            description: 'Moderate drizzle',              icon: '🌦️' };
    if (code === 55) return { condition: 'Heavy Drizzle',      description: 'Dense drizzle',                 icon: '🌧️' };
    if (code === 56) return { condition: 'Freezing Drizzle',   description: 'Light freezing drizzle',        icon: '🌨️' };
    if (code === 57) return { condition: 'Freezing Drizzle',   description: 'Heavy freezing drizzle',        icon: '🌨️' };
    if (code === 61) return { condition: 'Light Rain',         description: 'Slight rain',                   icon: '🌧️' };
    if (code === 63) return { condition: 'Rain',               description: 'Moderate rain',                 icon: '🌧️' };
    if (code === 65) return { condition: 'Heavy Rain',         description: 'Heavy rain',                    icon: '🌧️' };
    if (code === 66) return { condition: 'Freezing Rain',      description: 'Light freezing rain',           icon: '🌨️' };
    if (code === 67) return { condition: 'Freezing Rain',      description: 'Heavy freezing rain',           icon: '🌨️' };
    if (code === 71) return { condition: 'Light Snow',         description: 'Slight snowfall',               icon: '❄️'  };
    if (code === 73) return { condition: 'Snow',               description: 'Moderate snowfall',             icon: '🌨️' };
    if (code === 75) return { condition: 'Heavy Snow',         description: 'Heavy snowfall',                icon: '❄️'  };
    if (code === 77) return { condition: 'Snow Grains',        description: 'Snow grains',                   icon: '🌨️' };
    if (code === 80) return { condition: 'Light Showers',      description: 'Slight rain showers',           icon: '🌦️' };
    if (code === 81) return { condition: 'Showers',            description: 'Moderate rain showers',         icon: '🌧️' };
    if (code === 82) return { condition: 'Heavy Showers',      description: 'Violent rain showers',          icon: '⛈️'  };
    if (code === 85) return { condition: 'Snow Showers',       description: 'Slight snow showers',           icon: '🌨️' };
    if (code === 86) return { condition: 'Heavy Snow Showers', description: 'Heavy snow showers',            icon: '❄️'  };
    if (code === 95) return { condition: 'Thunderstorm',       description: 'Thunderstorm',                  icon: '⛈️'  };
    if (code === 96) return { condition: 'Hail Storm',         description: 'Thunderstorm with slight hail', icon: '⛈️'  };
    if (code === 99) return { condition: 'Heavy Hail Storm',   description: 'Thunderstorm with heavy hail',  icon: '⛈️'  };
    return { condition: 'Cloudy', description: 'Variable conditions', icon: '☁️' };
}

// ─── Main Fetch ────────────────────────────────────────────────────────────

export async function getWeather(lat: number, lon: number): Promise<WeatherData> {
    // Return cache if still fresh
    if (cachedWeather && Date.now() - lastWeatherFetch < WEATHER_CACHE_DURATION) {
        return cachedWeather;
    }

    try {
        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${lat.toFixed(4)}` +
            `&longitude=${lon.toFixed(4)}` +
            `&current_weather=true` +
            `&hourly=relativehumidity_2m` +
            `&timezone=auto` +
            `&forecast_days=1`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`Open-Meteo error: ${response.status}`);
        }

        const data = await response.json();
        const current = data.current_weather;

        if (!current) {
            throw new Error('No current_weather in Open-Meteo response');
        }

        const wmoInfo = wmoCodeToInfo(current.weathercode ?? 0);
        // Hourly humidity — index 0 is the first full hour of today
        const humidity: number = data.hourly?.relativehumidity_2m?.[0] ?? 60;

        const weatherData: WeatherData = {
            condition: wmoInfo.condition,
            temperature: Math.round(current.temperature ?? 20),
            description: wmoInfo.description,
            icon: wmoInfo.icon,
            humidity,
            windSpeed: Math.round(current.windspeed ?? 0), // Open-Meteo returns km/h by default
        };

        cachedWeather = weatherData;
        lastWeatherFetch = Date.now();

        return weatherData;
    } catch {
        // Return stale cache if available, otherwise use mock
        return cachedWeather ?? MOCK_WEATHER;
    }
}

export function getCachedWeather(): WeatherData {
    return cachedWeather ?? MOCK_WEATHER;
}

/** Explicitly invalidate the cache (e.g. when user moves to a new city) */
export function clearWeatherCache(): void {
    cachedWeather = null;
    lastWeatherFetch = 0;
}
