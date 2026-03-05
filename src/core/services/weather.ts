// OFFHOOK — Weather Service
// OpenWeatherMap integration with caching and mock fallback

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

const WEATHER_ICONS: Record<string, string> = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '🌨️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌤️',
    Smoke: '💨',
    Dust: '💨',
};

const MOCK_WEATHER: WeatherData = {
    condition: 'Partly Cloudy',
    temperature: 24,
    description: 'Warm with scattered clouds',
    icon: '🌤️',
    humidity: 65,
    windSpeed: 12,
};

// You can set your OpenWeatherMap API key here or via settings
let weatherApiKey: string | null = null;

export function setWeatherApiKey(key: string) {
    weatherApiKey = key;
}

export async function getWeather(lat: number, lon: number): Promise<WeatherData> {
    // Return cache if fresh
    if (cachedWeather && Date.now() - lastWeatherFetch < WEATHER_CACHE_DURATION) {
        return cachedWeather;
    }

    if (!weatherApiKey) {
        return MOCK_WEATHER;
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();

        const mainCondition = data.weather?.[0]?.main || 'Clear';
        const weatherData: WeatherData = {
            condition: mainCondition,
            temperature: Math.round(data.main?.temp || 24),
            description: data.weather?.[0]?.description || 'clear sky',
            icon: WEATHER_ICONS[mainCondition] || '🌤️',
            humidity: data.main?.humidity || 50,
            windSpeed: Math.round((data.wind?.speed || 0) * 3.6), // Convert m/s to km/h
        };

        cachedWeather = weatherData;
        lastWeatherFetch = Date.now();

        return weatherData;
    } catch (error) {
        console.warn('Weather fetch error, using mock:', error);
        return MOCK_WEATHER;
    }
}

export function getCachedWeather(): WeatherData {
    return cachedWeather || MOCK_WEATHER;
}
