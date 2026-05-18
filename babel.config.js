module.exports = function (api) {
    api.cache(true);
    
    // Check if we are building for web
    const isWeb = process.env.EXPO_PLATFORM === 'web' || process.env.npm_lifecycle_event === 'web';

    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    alias: {
                        'react-native-google-mobile-ads': './src/mocks/react-native-google-mobile-ads',
                    },
                },
            ],
            '@babel/plugin-syntax-import-meta',
            // Temporarily disabled due to ESM issues in Metro/Jest
            // 'react-native-reanimated/plugin',
        ],
    };
};
