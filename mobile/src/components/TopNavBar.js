import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Colors,
  Fonts,
  Spacing,
  Shadows,
  IconSize,
  Animation,
} from '../theme';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
export const BOTTOM_NAV_BAR_HEIGHT = 88;

/**
 * TopNavBar — Persistent bottom navigation bar.
 *
 * Tabs: "Comida" (Menu), "Carrito" (Cart), "Pago" (Payment), "Salir" (Logout/red)
 *
 * Props:
 *   - activeTab: 'menu' | 'cart' | 'payment'
 *   - onNavigate: function(tabName)
 *   - onLogout: function
 */

const NAV_ITEMS = [
  { key: 'menu', label: 'Comida', icon: 'restaurant-menu' },
  { key: 'cart', label: 'Carrito', icon: 'shopping-cart' },
  { key: 'payment', label: 'Pago', icon: 'payment' },
  { key: 'settings', label: 'Ajustes', icon: 'settings' },
];

export default function TopNavBar({ activeTab, onNavigate, onLogout }) {
  const insets = useSafeAreaInsets();
  const { totalItems } = useCart();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom + Spacing.sm, backgroundColor: colors.surfaceElevated },
      ]}
    >
      {/* Green accent line */}
      <View style={[styles.accentLine, { backgroundColor: colors.primary }]} />

      <View style={styles.navRow}>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.key}
            item={item}
            isActive={activeTab === item.key}
            onPress={() => onNavigate(item.key)}
            badge={item.key === 'cart' && totalItems > 0 ? totalItems : null}
            colors={colors}
          />
        ))}

        {/* Salir button — always red */}
        <LogoutButton onPress={onLogout} colors={colors} />
      </View>
    </View>
  );
}

function NavItem({ item, isActive, onPress, badge, colors }) {
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
      activeOpacity={0.7}
      style={[styles.navItem, animatedStyle]}
      accessibilityRole="tab"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: isActive }}
    >
      <View style={styles.iconWrapper}>
        <MaterialIcons
          name={item.icon}
          size={IconSize.standard}
          color={isActive ? colors.primary : colors.disabled}
        />
        {badge != null && (
          <View style={[styles.badge, { backgroundColor: colors.alert }]}>
            <Text style={[styles.badgeText, { color: colors.background }]}>
              {badge > 9 ? '9+' : badge}
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.navLabel, isActive ? [styles.navLabelActive, { color: colors.primary }] : [styles.navLabelInactive, { color: colors.disabled }]]}>
        {item.label}
      </Text>
      {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
    </AnimatedTouchable>
  );
}

function LogoutButton({ onPress, colors }) {
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
      activeOpacity={0.7}
      style={[styles.navItem, animatedStyle]}
      accessibilityRole="button"
      accessibilityLabel="Cerrar sesión"
    >
      <MaterialIcons
        name="exit-to-app"
        size={IconSize.standard}
        color={colors.alert}
      />
      <Text style={[styles.logoutLabel, { color: colors.alert }]}>Salir</Text>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.surfaceElevated,
    ...Shadows.topBar,
    zIndex: 100,
  },
  accentLine: {
    height: 5,
    backgroundColor: Colors.primary,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    minWidth: IconSize.touchTarget,
    minHeight: IconSize.touchTarget,
    position: 'relative',
  },
  iconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: Colors.alert,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.background,
    fontSize: 10,
    fontFamily: Fonts.interSemiBold,
    fontWeight: '700',
  },
  navLabel: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  navLabelActive: {
    fontFamily: Fonts.interSemiBold,
    color: Colors.primary,
  },
  navLabelInactive: {
    fontFamily: Fonts.interRegular,
    color: Colors.disabled,
  },
  logoutLabel: {
    fontSize: 11,
    marginTop: 2,
    fontFamily: Fonts.interSemiBold,
    color: Colors.alert,
    textAlign: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.primary,
  },
});
