// OFFHOOK — Category Selector
// Horizontal scroll categories with animated pills
import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius, AnimationConfig } from '../../core/theme';
import { EXCUSE_CATEGORIES, ExcuseCategory } from '../constants/categories';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CategorySelectorProps {
    selected: string;
    onSelect: (category: ExcuseCategory) => void;
}

const CategoryPill: React.FC<{
    category: ExcuseCategory;
    isSelected: boolean;
    onPress: () => void;
}> = ({ category, isSelected, onPress }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable
            style={[
                styles.pill,
                isSelected && styles.pillSelected,
                animatedStyle,
            ]}
            onPressIn={() => {
                scale.value = withSpring(0.92, AnimationConfig.spring.snappy);
            }}
            onPressOut={() => {
                scale.value = withSpring(1, AnimationConfig.spring.bouncy);
            }}
            onPress={() => {
                Haptics.selectionAsync();
                onPress();
            }}
        >
            <Text style={styles.pillIcon}>{category.icon}</Text>
            <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                {category.label}
            </Text>
        </AnimatedPressable>
    );
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
    selected,
    onSelect,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Category</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {EXCUSE_CATEGORIES.map((cat) => (
                    <CategoryPill
                        key={cat.id}
                        category={cat}
                        isSelected={selected === cat.id}
                        onPress={() => onSelect(cat)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.labelMedium,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
        marginLeft: Spacing.xs,
    },
    scrollContent: {
        paddingHorizontal: Spacing.xs,
        gap: Spacing.sm,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm + 2,
        borderRadius: BorderRadius.round,
        backgroundColor: Colors.surfaceLight,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    pillSelected: {
        backgroundColor: `${Colors.accent1}20`,
        borderColor: Colors.accent1,
    },
    pillIcon: {
        fontSize: 16,
    },
    pillText: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    pillTextSelected: {
        color: Colors.accent1,
    },
});
