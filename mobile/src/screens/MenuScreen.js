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
import { useTheme } from '../context/ThemeContext';
import { CATEGORIES, getItemsByCategory } from '../data/menuData';
import TopNavBar, { BOTTOM_NAV_BAR_HEIGHT } from '../components/TopNavBar';
import CategoryTabs from '../components/CategoryTabs';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { addToCart, getItemQuantity, getCartItemQuantity, updateQuantity } = useCart();
  const { logout } = useAuth();
  const { colors, isHighContrast } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const rawItems = getItemsByCategory(activeCategory);
  const menuItems = React.useMemo(() => {
    return rawItems.filter((item) => {
      // 1. Text search
      const query = searchQuery.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(query) || 
                            item.description.toLowerCase().includes(query);
      if (!matchesSearch) return false;

      // 2. Price filter
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && item.price < min) return false;
      if (!isNaN(max) && item.price > max) return false;

      return true;
    });
  }, [rawItems, searchQuery, minPrice, maxPrice]);
  const activeCategoryLabel =
    CATEGORIES.find((c) => c.id === activeCategory)?.label || '';

  const handleNavigate = useCallback(
    (tab) => {
      if (tab === 'cart') navigation.navigate('Cart');
      else if (tab === 'payment') navigation.navigate('Payment');
      else if (tab === 'settings') navigation.navigate('Settings');
    },
    [navigation]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleIncrease = useCallback(
    (item, details = '') => {
      const cartItemId = `${item.id}-${details}`;
      const currentQty = getCartItemQuantity(cartItemId);
      if (currentQty === 0) {
        addToCart({ ...item, details, cartItemId });
      } else {
        updateQuantity(cartItemId, currentQty + 1);
      }
    },
    [addToCart, getCartItemQuantity, updateQuantity]
  );

  const handleDecrease = useCallback(
    (itemId, details = '') => {
      const cartItemId = `${itemId}-${details}`;
      const currentQty = getCartItemQuantity(cartItemId);
      if (currentQty > 0) {
        updateQuantity(cartItemId, currentQty - 1);
      }
    },
    [getCartItemQuantity, updateQuantity]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style={isHighContrast ? "light" : "dark"} />

      {/* Top Navigation */}
      <TopNavBar
        activeTab="menu"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
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
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: BOTTOM_NAV_BAR_HEIGHT + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {menuItems.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            quantity={getItemQuantity(item.id)}
            onIncrease={(details) => handleIncrease(item, details)}
            onDecrease={(details) => handleDecrease(item.id, details)}
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

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    backgroundColor: colors.surfaceSubtle,
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 22,
    color: colors.text,
  },
  sectionCount: {
    ...Typography.bodySmall,
    color: colors.disabled,
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
    color: colors.disabled,
    textAlign: 'center',
  },
});
