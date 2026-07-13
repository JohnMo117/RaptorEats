import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Colors,
  Fonts,
  Spacing,
  BorderRadius,
  Animation,
  IconSize,
} from '../theme';
import { useTheme } from '../context/ThemeContext';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * CategoryTabs — Horizontal scrollable category selector with pill/badge style.
 *
 * Props:
 *   - categories: Array<{ id, label, icon }>
 *   - activeCategory: string (category id)
 *   - onSelect: function(categoryId)
 */
export default function CategoryTabs({ categories, activeCategory, onSelect }) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        bounces={false}
      >
        {categories.map((cat) => (
          <CategoryPill
            key={cat.id}
            category={cat}
            isActive={activeCategory === cat.id}
            onPress={() => onSelect(cat.id)}
            colors={colors}
            styles={styles}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function CategoryPill({ category, isActive, onPress, colors, styles }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(Animation.press.scaleTo, {
      duration: Animation.press.duration,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
      style={[
        styles.pill,
        isActive ? styles.pillActive : styles.pillInactive,
        animatedStyle,
      ]}
      accessibilityRole="tab"
      accessibilityLabel={category.label}
      accessibilityState={{ selected: isActive }}
    >
      <MaterialIcons
        name={category.icon}
        size={18}
        color={isActive ? colors.background : colors.bodyColor}
        style={styles.pillIcon}
      />
      <Text style={[styles.pillText, isActive ? styles.pillTextActive : styles.pillTextInactive]}>
        {category.label}
      </Text>
    </AnimatedTouchable>
  );
}

const createStyles = (colors) => StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    paddingVertical: Spacing.md,
  },
  container: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.badge,
    minHeight: 40,
  },
  pillActive: {
    backgroundColor: colors.primary,
  },
  pillInactive: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pillIcon: {
    marginRight: Spacing.xs,
  },
  pillText: {
    fontFamily: Fonts.interSemiBold,
    fontSize: 14,
    lineHeight: 18,
  },
  pillTextActive: {
    color: colors.background,
  },
  pillTextInactive: {
    color: colors.bodyColor,
  },
});
