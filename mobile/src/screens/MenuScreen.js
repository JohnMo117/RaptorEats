import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  Colors,
  Typography,
  Spacing,
} from '../theme';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, getItemsByCategory } from '../data/menuData';
import TopNavBar from '../components/TopNavBar';
import CategoryTabs from '../components/CategoryTabs';
import ProductCard from '../components/ProductCard';

/**
 * MenuScreen — Screen 2: Comida (Main Menu)
 *
 * - TopNavBar (Comida active)
 * - Horizontal category tabs
 * - ScrollView of ProductCards filtered by selected category
 * - Section title for current category
 */
export default function MenuScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [refreshing, setRefreshing] = useState(false);
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const { logout } = useAuth();

  const menuItems = getItemsByCategory(activeCategory);
  const activeCategoryLabel =
    CATEGORIES.find((c) => c.id === activeCategory)?.label || '';

  const handleNavigate = useCallback(
    (tab) => {
      if (tab === 'cart') navigation.navigate('Cart');
      else if (tab === 'payment') navigation.navigate('Payment');
    },
    [navigation]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleIncrease = useCallback(
    (item) => {
      const currentQty = getItemQuantity(item.id);
      if (currentQty === 0) {
        addToCart(item);
      } else {
        updateQuantity(item.id, currentQty + 1);
      }
    },
    [addToCart, getItemQuantity, updateQuantity]
  );

  const handleDecrease = useCallback(
    (itemId) => {
      const currentQty = getItemQuantity(itemId);
      if (currentQty > 0) {
        updateQuantity(itemId, currentQty - 1);
      }
    },
    [getItemQuantity, updateQuantity]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Navigation */}
      <TopNavBar
        activeTab="menu"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* Category Tabs */}
      <CategoryTabs
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{activeCategoryLabel}</Text>
        <Text style={styles.sectionCount}>
          {menuItems.length} {menuItems.length === 1 ? 'platillo' : 'platillos'}
        </Text>
      </View>

      {/* Menu Items */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {menuItems.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            quantity={getItemQuantity(item.id)}
            onIncrease={() => handleIncrease(item)}
            onDecrease={() => handleDecrease(item.id)}
          />
        ))}

        {menuItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🦖</Text>
            <Text style={styles.emptyText}>
              No hay platillos disponibles en esta categoría.
            </Text>
          </View>
        )}

        {/* Bottom padding for scroll */}
        <View style={styles.scrollPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surfaceSubtle,
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 22,
  },
  sectionCount: {
    ...Typography.bodySmall,
    color: Colors.disabled,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.sm,
  },
  scrollPadding: {
    height: Spacing.xxl,
  },

  // ── Empty State ─────────────────────────────
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.section * 2,
    paddingHorizontal: Spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.base,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.disabled,
    textAlign: 'center',
  },
});
