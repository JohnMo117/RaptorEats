import React, { useState, useEffect, useCallback } from 'react';
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
  BorderRadius,
  Shadows,
  Fonts,
} from '../theme';
import { apiClient, SOCKET_URL } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TopNavBar, { BOTTOM_NAV_BAR_HEIGHT } from '../components/TopNavBar';
import { MaterialIcons } from '@expo/vector-icons';
import { io } from 'socket.io-client';
import * as Notifications from 'expo-notifications';

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();
  const { colors, isHighContrast } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();

  const fetchOrders = async () => {
    try {
      const data = await apiClient('/orders/me');
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders().finally(() => setLoading(false));

    // Setup Socket.io for real-time order updates
    const socket = io(SOCKET_URL);

    socket.on('orderUpdated', (updatedOrder) => {
      // Only process updates for the current user's orders
      if (user && updatedOrder.userId === user.id) {
        setOrders((prevOrders) => 
          prevOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o)
        );

        // If order just became READY, show a push notification
        if (updatedOrder.status === 'READY') {
          Notifications.scheduleNotificationAsync({
            content: {
              title: '¡Tu pedido está listo! 🍔',
              body: `El pedido #${updatedOrder.id} ya está listo para recoger en cafetería.`,
              sound: true,
            },
            trigger: null, // Send immediately
          });
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, []);

  const handleNavigate = useCallback(
    (tab) => {
      if (tab === 'menu') navigation.navigate('Menu');
      else if (tab === 'cart') navigation.navigate('Cart');
      else if (tab === 'payment') navigation.navigate('Payment');
      else if (tab === 'settings') navigation.navigate('Settings');
    },
    [navigation]
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return colors.alert;
      case 'PREPARING': return colors.primary;
      case 'READY': return colors.success || '#10b981';
      case 'COMPLETED': return colors.disabled;
      case 'CANCELLED': return colors.alert;
      default: return colors.text;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'PENDING': return 'Pendiente';
      case 'PREPARING': return 'Preparando';
      case 'READY': return 'Listo para entregar';
      case 'COMPLETED': return 'Entregado';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  };

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

      <TopNavBar
        activeTab="orders"
        onNavigate={handleNavigate}
        onLogout={logout}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Pedidos</Text>
      </View>

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
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="receipt-long" size={48} color={colors.disabledLight} style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No has realizado ningún pedido aún.</Text>
          </View>
        ) : (
          orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Pedido #{order.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                    {getStatusText(order.status)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              {order.items.map((item, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemName}>
                    <Text style={styles.itemQty}>{item.quantity}x </Text>
                    {item.product.name}
                  </Text>
                  <Text style={styles.itemPrice}>${item.subtotal.toFixed(2)}</Text>
                </View>
              ))}
              
              <View style={styles.divider} />
              
              <View style={styles.orderFooter}>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Text>
                <Text style={styles.orderTotal}>${order.totalPrice.toFixed(2)}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    ...Typography.h2,
    fontSize: 22,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  
  // ── Order Card ──────────────────────────────
  orderCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: BorderRadius.card,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadows.card,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  orderId: {
    ...Typography.h3,
    fontSize: 16,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.badge,
  },
  statusText: {
    fontFamily: Fonts.interSemiBold,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginVertical: Spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  itemQty: {
    fontFamily: Fonts.interSemiBold,
    color: colors.primary,
  },
  itemName: {
    ...Typography.body,
    flex: 1,
    color: colors.text,
  },
  itemPrice: {
    ...Typography.body,
    color: colors.text,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  orderDate: {
    ...Typography.bodySmall,
    color: colors.disabled,
  },
  orderTotal: {
    ...Typography.priceTotal,
    fontSize: 18,
    color: colors.primary,
  },
  
  // ── Empty State ─────────────────────────────
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.section * 2,
  },
  emptyIcon: {
    marginBottom: Spacing.base,
  },
  emptyText: {
    ...Typography.body,
    color: colors.disabled,
    textAlign: 'center',
  },
});
