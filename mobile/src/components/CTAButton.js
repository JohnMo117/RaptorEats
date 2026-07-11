import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Typography, BorderRadius, Spacing, Animation } from '../theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * CTAButton — Primary action button with scale/bounce micro-interaction.
 *
 * Variants:
 *   - 'primary' (default): Green background (#118C2D), white text
 *   - 'alert': Red background (#A82020), white text
 *   - 'outline': White background, green border, green text
 *   - 'whatsapp': Green WhatsApp-style button
 *   - 'disabled': Gray background, white text
 *
 * Props:
 *   - title: string
 *   - onPress: function
 *   - variant: 'primary' | 'alert' | 'outline' | 'whatsapp' | 'disabled'
 *   - loading: boolean (shows spinner)
 *   - icon: React node (optional left icon)
 *   - style: additional styles
 *   - fullWidth: boolean (default true)
 */
export default function CTAButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  icon = null,
  style,
  fullWidth = true,
  disabled = false,
}) {
  const scale = useSharedValue(1);
  const isDisabled = disabled || variant === 'disabled' || loading;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isDisabled) {
      scale.value = withTiming(Animation.press.scaleTo, {
        duration: Animation.press.duration,
      });
    }
  };

  const handlePressOut = () => {
    if (!isDisabled) {
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 200,
      });
    }
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'alert':
        return styles.alertButton;
      case 'outline':
        return styles.outlineButton;
      case 'whatsapp':
        return styles.whatsappButton;
      case 'disabled':
        return styles.disabledButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;
      default:
        return styles.buttonText;
    }
  };

  return (
    <AnimatedTouchable
      onPress={isDisabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={isDisabled ? 1 : 0.9}
      style={[
        styles.base,
        getButtonStyle(),
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabledButton,
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? Colors.primary : Colors.background}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[getTextStyle(), isDisabled && styles.disabledText]}>
            {title}
          </Text>
        </View>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  iconContainer: {
    marginRight: Spacing.xs,
  },

  // ── Variants ────────────────────────────────
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  alertButton: {
    backgroundColor: Colors.alert,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  disabledButton: {
    backgroundColor: Colors.disabledLight,
  },

  // ── Text ────────────────────────────────────
  buttonText: {
    ...Typography.button,
    color: Colors.background,
    textAlign: 'center',
  },
  outlineText: {
    ...Typography.button,
    color: Colors.primary,
    textAlign: 'center',
  },
  disabledText: {
    color: Colors.disabled,
  },
});
