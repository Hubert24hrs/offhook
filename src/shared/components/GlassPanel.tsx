// OFFHOOK — GlassPanel Component
// Frosted glass container with blur and border glow
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing } from '../../core/theme';

interface GlassPanelProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: 'light' | 'medium' | 'heavy';
    glowColor?: string;
    noPadding?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
    children,
    style,
    intensity = 'medium',
    glowColor,
    noPadding = false,
}) => {
    const bgOpacity = intensity === 'light' ? 0.04 : intensity === 'heavy' ? 0.12 : 0.06;
    const borderOpacity = intensity === 'light' ? 0.08 : intensity === 'heavy' ? 0.2 : 0.12;

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
                    borderColor: glowColor
                        ? `${glowColor}40`
                        : `rgba(255, 255, 255, ${borderOpacity})`,
                },
                !noPadding && styles.padding,
                style,
            ]}
        >
            <LinearGradient
                colors={[
                    `rgba(255, 255, 255, ${bgOpacity + 0.02})`,
                    `rgba(255, 255, 255, ${bgOpacity * 0.3})`,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            {glowColor && (
                <View
                    style={[
                        styles.glow,
                        {
                            backgroundColor: glowColor,
                            shadowColor: glowColor,
                        },
                    ]}
                />
            )}
            <View style={styles.content}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        overflow: 'hidden',
        position: 'relative',
    },
    padding: {
        padding: Spacing.lg,
    },
    content: {
        position: 'relative',
        zIndex: 1,
    },
    glow: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        opacity: 0.08,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 40,
    },
});
