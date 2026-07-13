import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Animation,
  IconSize,
} from '../theme';
import { useTheme } from '../context/ThemeContext';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * QuantityControl — Reusable [ - ] [ qty ] [ + ] component
 * with bounce animation on each button press.
 *
 * Props:
 *   - quantity: number (current quantity)
 *   - onIncrease: function
 *   - onDecrease: function
 *   - minValue: number (default 0)
 *   - maxValue: number (default 99)
 *   - size: 'small' | 'normal' (default 'normal')
 */
export default function QuantityControl({
  quantity = 0,
  onIncrease,
  onDecrease,
  minValue = 0,
  maxValue = 99,
  size = 'normal',
}) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const minusScale = useSharedValue(1);
  const plusScale = useSharedValue(1);

  const minusAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: minusScale.value }],
  }));

  const plusAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: plusScale.value }],
  }));

  const handleDecrease = () => {
    if (quantity > minValue) {
      minusScale.value = withTiming(Animation.press.scaleTo, {
        duration: Animation.press.duration,
      });
      setTimeout(() => {
        minusScale.value = withSpring(1, { damping: 12, stiffness: 200 });
      }, Animation.press.duration);
      onDecrease();
    }
  };

  const handleIncrease = () => {
    if (quantity < maxValue) {
      plusScale.value = withTiming(Animation.press.scaleTo, {
        duration: Animation.press.duration,
      });
      setTimeout(() => {
        plusScale.value = withSpring(1, { damping: 12, stiffness: 200 });
      }, Animation.press.duration);
      onIncrease();
    }
  };

  const isSmall = size === 'small';
  const buttonSize = isSmall ? 28 : 36;
  const iconSz = isSmall ? 16 : 20;

  const canDecrease = quantity > minValue;
  const canIncrease = quantity < maxValue;

  return (
    <View style={[styles.container, isSmall && styles.containerSmall]}>
      <AnimatedTouchable
        onPress={handleDecrease}
        style={[
          styles.button,
          { width: buttonSize, height: buttonSize },
          !canDecrease && styles.buttonDisabled,
          minusAnimatedStyle,
        ]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Disminuir cantidad"
        accessibilityState={{ disabled: !canDecrease }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialIcons
          name="remove"
          size={iconSz}
          color={canDecrease ? colors.primary : colors.disabled}
        />
      </AnimatedTouchable>

      <View style={[styles.quantityContainer, isSmall && styles.quantityContainerSmall]}>
        <Text style={[styles.quantityText, isSmall && styles.quantityTextSmall]}>
          {quantity}
        </Text>
      </View>

      <AnimatedTouchable
        onPress={handleIncrease}
        style={[
          styles.button,
          { width: buttonSize, height: buttonSize },
          styles.buttonPlus,
          !canIncrease && styles.buttonDisabled,
          plusAnimatedStyle,
        ]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Aumentar cantidad"
        accessibilityState={{ disabled: !canIncrease }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialIcons
          name="add"
          size={iconSz}
          color={canIncrease ? colors.background : colors.disabled}
        />
      </AnimatedTouchable>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  containerSmall: {
    gap: 2,
  },
  button: {
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  buttonPlus: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonDisabled: {
    borderColor: colors.disabledLight,
    backgroundColor: colors.surfaceSubtle,
  },
  quantityContainer: {
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  quantityContainerSmall: {
    minWidth: 24,
  },
  quantityText: {
    fontFamily: Typography.h3.fontFamily,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  quantityTextSmall: {
    fontSize: 14,
  },
});
