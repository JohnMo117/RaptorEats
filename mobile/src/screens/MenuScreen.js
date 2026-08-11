import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Colors,
  Typography,
  Spacing,
} from '../theme';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiClient } from '../api/client';
import TopNavBar, { BOTTOM_NAV_BAR_HEIGHT } from '../components/TopNavBar';
import CategoryTabs from '../components/CategoryTabs';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

export default function MenuScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { addToCart, getItemQuantity, getCartItemQuantity, updateQuantity } = useCart();
  const { logout } = useAuth();
  const { colors, isHighContrast } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();

  const fetchMenu = async () => {
    try {
      const data = await apiClient('/menu');
      // Format backend categories to match frontend props
      const formatted = data.map(cat => ({
        id: String(cat.id),
        label: cat.name,
        products: cat.products || []
      }));
      setCategories(formatted);
      if (formatted.length > 0 && !activeCategory) {
        setActiveCategory(formatted[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    }
  };

  useEffect(() => {
    fetchMenu().finally(() => setLoading(false));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMenu();
    setRefreshing(false);
  }, []);

  const activeCategoryObj = categories.find((c) => c.id === activeCategory) || { products: [] };
  const rawItems = activeCategoryObj.products;
  
  const menuItems = React.useMemo(() => {
    return rawItems.filter((item) => {
      // 1. Text search
      const query = searchQuery.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(query) || 
                            (item.description && item.description.toLowerCase().includes(query));
      if (!matchesSearch) return false;

      // 2. Price filter
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && item.price < min) return false;
      if (!isNaN(max) && item.price > max) return false;

      return true;
    });
  }, [rawItems, searchQuery, minPrice, maxPrice]);

  const activeCategoryLabel = activeCategoryObj.label || '';

  const handleNavigate = useCallback(
    (tab) => {
      if (tab === 'cart') navigation.navigate('Cart');
      else if (tab === 'payment') navigation.navigate('Payment');
      else if (tab === 'settings') navigation.navigate('Settings');
      else if (tab === 'orders') navigation.navigate('Orders');
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

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
      {categories.length > 0 && (
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      )}

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
              No hay platillos disponibles.
            </Text>
          </View>
        )}

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
