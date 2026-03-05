// OFFHOOK — Animated Risk Gauge Component
// Animated semicircle gauge from green (safe) to red (risky)
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    useDerivedValue,
    useAnimatedStyle,
    interpolateColor,
} from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors, Typography, AnimationConfig } from '../../core/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface RiskGaugeProps {
    score: number; // 1-100
    size?: number;
    showLabel?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
    score,
    size = 200,
    showLabel = true,
}) => {
    const progress = useSharedValue(0);
    const displayScore = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(score / 100, {
            duration: AnimationConfig.gauge.duration,
        });
        displayScore.value = withTiming(score, {
            duration: AnimationConfig.gauge.duration,
        });
    }, [score]);

    const center = size / 2;
    const radius = (size - 30) / 2;
    const strokeWidth = 12;

    // Create arc path for the gauge background
    const startAngle = -210;
    const endAngle = 30;
    const totalAngle = endAngle - startAngle; // 240 degrees

    const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
        const angleRad = ((angleDeg - 90) * Math.PI) / 180;
        return {
            x: cx + r * Math.cos(angleRad),
            y: cy + r * Math.sin(angleRad),
        };
    };

    const createArc = (start: number, end: number) => {
        const startPoint = polarToCartesian(center, center, radius, start);
        const endPoint = polarToCartesian(center, center, radius, end);
        const largeArc = Math.abs(end - start) > 180 ? 1 : 0;
        return `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArc} 1 ${endPoint.x} ${endPoint.y}`;
    };

    const bgPath = createArc(startAngle, endAngle);

    const animatedProps = useAnimatedProps(() => {
        const currentAngle = startAngle + totalAngle * progress.value;
        const startPoint = polarToCartesian(center, center, radius, startAngle);
        const endPoint = polarToCartesian(center, center, radius, currentAngle);
        const largeArc = Math.abs(currentAngle - startAngle) > 180 ? 1 : 0;
        const d = `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArc} 1 ${endPoint.x} ${endPoint.y}`;
        return { d };
    });

    const needleAnimatedProps = useAnimatedProps(() => {
        const currentAngle = startAngle + totalAngle * progress.value;
        const point = polarToCartesian(center, center, radius - 25, currentAngle);
        return {
            cx: point.x,
            cy: point.y,
        };
    });

    const scoreColor = useDerivedValue(() => {
        return interpolateColor(
            progress.value,
            [0, 0.3, 0.6, 1],
            [Colors.riskLow, Colors.riskMedium, Colors.riskHigh, Colors.riskCritical]
        );
    });

    const scoreTextStyle = useAnimatedStyle(() => ({
        color: scoreColor.value,
    }));

    const getRiskLabel = (s: number): string => {
        if (s <= 25) return 'SAFE';
        if (s <= 50) return 'MODERATE';
        if (s <= 75) return 'RISKY';
        return 'DANGEROUS';
    };

    const getStrokeColor = (s: number): string => {
        if (s <= 25) return Colors.riskLow;
        if (s <= 50) return Colors.riskMedium;
        if (s <= 75) return Colors.riskHigh;
        return Colors.riskCritical;
    };

    return (
        <View style={[styles.container, { width: size, height: size * 0.65 }]}>
            <Svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
                {/* Background arc */}
                <Path
                    d={bgPath}
                    stroke={Colors.surfaceLight}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Progress arc */}
                <AnimatedPath
                    animatedProps={animatedProps}
                    stroke={getStrokeColor(score)}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Needle dot */}
                <AnimatedCircle
                    animatedProps={needleAnimatedProps}
                    r={6}
                    fill={getStrokeColor(score)}
                />
            </Svg>

            {/* Score display */}
            <View style={styles.scoreContainer}>
                <Animated.Text style={[styles.scoreText, scoreTextStyle]}>
                    {Math.round(score)}
                </Animated.Text>
                {showLabel && (
                    <Text style={[styles.labelText, { color: getStrokeColor(score) }]}>
                        {getRiskLabel(score)}
                    </Text>
                )}
            </View>
        </View>
    );
};

const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad),
    };
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    scoreContainer: {
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 42,
        fontWeight: '800',
        letterSpacing: -2,
    },
    labelText: {
        ...Typography.labelMedium,
        marginTop: -4,
    },
});
