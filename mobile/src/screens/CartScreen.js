import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Colors,
  Typography,
  Fonts,
  Spacing,
  BorderRadius,
  Shadows,
} from '../theme';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TopNavBar, { BOTTOM_NAV_BAR_HEIGHT } from '../components/TopNavBar';
import QuantityControl from '../components/QuantityControl';
import CTAButton from '../components/CTAButton';

/**
 * CartScreen — Screen 3: Carrito (Cart)
 *
 * - TopNavBar (Carrito active)
 * - FlatList of cart items with quantity controls
 * - Empty state if cart is empty
 * - Fixed bottom bar with total and "Confirmar Pedido" CTA
 */
export default function CartScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const { logout } = useAuth();
  const { colors, isHighContrast } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const handleNavigate = useCallback(
    (tab) => {
      if (tab === 'menu') navigation.navigate('Menu');
      else if (tab === 'payment') navigation.navigate('Payment');
      else if (tab === 'settings') navigation.navigate('Settings');
    },
    [navigation]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleConfirmOrder = useCallback(() => {
    if (totalItems > 0) {
      navigation.navigate('Payment');
    }
  }, [navigation, totalItems]);

  const renderCartItem = useCallback(
    ({ item }) => (
      <View style={styles.cartItem}>
        <Image
          source={item.image}
          style={styles.itemImage}
          resizeMode="cover"
          accessibilityLabel={item.name}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          {item.details ? (
            <Text style={styles.itemDetails} numberOfLines={2}>
              {item.details}
            </Text>
          ) : null}
          <Text style={styles.itemPrice}>
            ${item.price.toFixed(2)} c/u
          </Text>
          <Text style={styles.itemSubtotal}>
            Subtotal: ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
        <View style={styles.itemControls}>
          <QuantityControl
            quantity={item.quantity}
            onIncrease={() => updateQuantity(item.cartItemId, item.quantity + 1)}
            onDecrease={() => updateQuantity(item.cartItemId, item.quantity - 1)}
            size="small"
          />
        </View>
      </View>
    ),
    [updateQuantity]
  );

  const keyExtractor = useCallback((item) => item.cartItemId, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style={isHighContrast ? "light" : "dark"} />

      {/* Top Navigation */}
      <TopNavBar
        activeTab="cart"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tu Carrito</Text>
        {totalItems > 0 && (
          <Text style={styles.headerCount}>
            {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
          </Text>
        )}
      </View>

      {/* Cart Items */}
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderCartItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: BOTTOM_NAV_BAR_HEIGHT + insets.bottom + Spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons
            name="shopping-cart"
            size={64}
            color={colors.disabledLight}
          />
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtext}>
            Explora el menú y agrega tus platillos favoritos.
          </Text>
          <CTAButton
            title="Ver Menú"
            onPress={() => navigation.navigate('Menu')}
            variant="outline"
            fullWidth={false}
            style={styles.emptyButton}
          />
        </View>
      )}

      {/* Bottom Bar — Total & Confirm */}
      {items.length > 0 && (
        <View
          style={[
            styles.bottomBar,
            {
              paddingBottom: insets.bottom + Spacing.base,
              bottom: BOTTOM_NAV_BAR_HEIGHT,
            },
          ]}
        >
          {/* Order Summary */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total a pagar:</Text>
            <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
          </View>

          {/* Confirm CTA */}
          <CTAButton
            title="Confirmar Pedido"
            onPress={handleConfirmOrder}
            icon={
              <MaterialIcons
                name="check-circle"
                size={20}
                color={colors.background}
              />
            }
          />
        </View>
      )}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
  },

  // ── Header ──────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
    backgroundColor: colors.surfaceSubtle,
  },
  headerTitle: {
    ...Typography.h2,
    fontSize: 22,
    color: colors.text,
  },
  headerCount: {
    ...Typography.bodySmall,
    color: colors.disabled,
  },

  // ── List ────────────────────────────────────
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.section * 3,
  },
  separator: {
    height: Spacing.md,
  },

  // ── Cart Item ───────────────────────────────
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: BorderRadius.card,
    padding: Spacing.md,
    ...Shadows.card,
  },
  itemImage: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.sm,
    backgroundColor: colors.surfaceSubtle,
  },
  itemInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.sm,
  },
  itemName: {
    ...Typography.h3,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 2,
    color: colors.bodyColor,
  },
  itemDetails: {
    ...Typography.bodySmall,
    color: colors.primary,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  itemPrice: {
    ...Typography.bodySmall,
    color: colors.disabled,
    marginBottom: 2,
  },
  itemSubtotal: {
    ...Typography.price,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  itemControls: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Empty State ─────────────────────────────
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  emptyTitle: {
    ...Typography.h3,
    fontSize: 20,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    color: colors.text,
  },
  emptySubtext: {
    ...Typography.body,
    color: colors.disabled,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    paddingHorizontal: Spacing.xxl,
  },

  // ── Bottom Bar ──────────────────────────────
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceElevated,
    paddingTop: Spacing.base,
    paddingHorizontal: Spacing.base,
    borderTopLeftRadius: Spacing.lg,
    borderTopRightRadius: Spacing.lg,
    ...Shadows.bottomBar,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  totalLabel: {
    ...Typography.body,
    fontSize: 16,
    color: colors.bodyColor,
  },
  totalPrice: {
    ...Typography.priceTotal,
    fontSize: 22,
    color: colors.primary,
  },
});
