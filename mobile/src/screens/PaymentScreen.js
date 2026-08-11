import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Fonts,
  Spacing,
  BorderRadius,
  Shadows,
  Animation,
} from '../theme';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PAYMENT_INFO, PAYMENT_INSTRUCTIONS } from '../data/paymentData';
import { apiClient } from '../api/client';
import TopNavBar, { BOTTOM_NAV_BAR_HEIGHT } from '../components/TopNavBar';
import CTAButton from '../components/CTAButton';

/**
 * PaymentScreen — Screen 4: Pago (Payment)
 *
 * - TopNavBar (Pago active)
 * - Transfer instructions
 * - Read-only fields: recipient name, card number (masked), CLABE (masked)
 * - Copy-to-clipboard buttons
 * - WhatsApp CTA to send receipt
 */
export default function PaymentScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { items, totalPrice, clearCart } = useCart();
  const { logout } = useAuth();
  const { colors, isHighContrast } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const handleNavigate = useCallback(
    (tab) => {
      if (tab === 'menu') navigation.navigate('Menu');
      else if (tab === 'cart') navigation.navigate('Cart');
      else if (tab === 'settings') navigation.navigate('Settings');
      else if (tab === 'orders') navigation.navigate('Orders');
    },
    [navigation]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleConfirmOrder = useCallback(async () => {
    if (items.length === 0) return;
    setLoading(true);
    
    try {
      const orderData = {
        totalPrice: totalPrice,
        items: items.map(item => ({
          productId: Number(item.id),
          quantity: item.quantity,
          unitPrice: item.price
        }))
      };

      const response = await apiClient('/orders', {
        method: 'POST',
        body: orderData
      });

      let maxPrepTime = 0;
      items.forEach(item => {
        if (item.prepTime && item.prepTime > maxPrepTime) {
          maxPrepTime = item.prepTime;
        }
      });
      // Base time is 2 minutes for prep/packaging, plus max dish prep time
      const totalEstTime = (maxPrepTime > 0 ? maxPrepTime : 0) + 2;
      setEstimatedTime(totalEstTime);
      setTimeRemaining(totalEstTime * 60); // Convert to seconds
      setIsConfirmed(true);
      clearCart();
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo procesar el pedido. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [items, totalPrice, clearCart]);

  useEffect(() => {
    if (isConfirmed && timeRemaining > 0) {
      const timerId = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [isConfirmed, timeRemaining]);

  const handleCopyToClipboard = useCallback(async (text) => {
    await Clipboard.setStringAsync(text);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style={isHighContrast ? "light" : "dark"} />

      {/* Top Navigation */}
      <TopNavBar
        activeTab="payment"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + BOTTOM_NAV_BAR_HEIGHT + Spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Datos de Pago</Text>
          {totalPrice > 0 && (
            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeText}>
                ${totalPrice.toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <View style={styles.instructionsHeader}>
            <MaterialIcons name="info" size={22} color={colors.primary} />
            <Text style={styles.instructionsTitle}>
              {PAYMENT_INSTRUCTIONS.title}
            </Text>
          </View>
          {PAYMENT_INSTRUCTIONS.steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Payment Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Información Bancaria</Text>

          <PaymentField
            label="Nombre de la persona a transferir"
            value={PAYMENT_INFO.recipientName}
            copyValue={PAYMENT_INFO.recipientName}
            onCopy={handleCopyToClipboard}
            icon="person"
            colors={colors}
          />

          <View style={styles.fieldDivider} />

          <PaymentField
            label="Número de tarjeta"
            value={PAYMENT_INFO.cardNumber}
            copyValue={PAYMENT_INFO.cardNumberFull}
            onCopy={handleCopyToClipboard}
            icon="credit-card"
            colors={colors}
          />

          <View style={styles.fieldDivider} />

          <PaymentField
            label="Número interbancario (CLABE)"
            value={PAYMENT_INFO.clabe}
            copyValue={PAYMENT_INFO.clabeFull}
            onCopy={handleCopyToClipboard}
            icon="account-balance"
            colors={colors}
          />

          <View style={styles.fieldDivider} />

          <PaymentField
            label="Banco"
            value={PAYMENT_INFO.bankName}
            copyValue={PAYMENT_INFO.bankName}
            onCopy={handleCopyToClipboard}
            icon="business"
            colors={colors}
          />
        </View>

        {/* Order Confirmation / Timer */}
        <View style={styles.confirmationSection}>
          {!isConfirmed ? (
            <CTAButton
              title="Confirmar Pedido"
              onPress={handleConfirmOrder}
              variant="primary"
              icon={
                <MaterialIcons
                  name="check-circle"
                  size={22}
                  color={colors.background}
                />
              }
            />
          ) : (
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>Tiempo estimado restante:</Text>
              <Text style={styles.timerValue}>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </Text>
              <Text style={styles.timerHint}>
                {timeRemaining > 0 ? 'Tu pedido se está preparando.' : '¡Tu pedido está listo!'}
              </Text>
            </View>
          )}
        </View>

        {/* Order Summary */}
        {items.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen del Pedido</Text>
            {items.map((item) => (
              <View key={item.id} style={styles.summaryRow}>
                <Text style={styles.summaryItemName} numberOfLines={1}>
                  {item.name} ×{item.quantity}
                </Text>
                <Text style={styles.summaryItemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalPrice}>
                ${totalPrice.toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/**
 * PaymentField — Read-only field with copy-to-clipboard
 */
function PaymentField({ label, value, copyValue, onCopy, icon, colors }) {
  const scale = useSharedValue(1);
  const [copied, setCopied] = React.useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleCopy = async () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    await onCopy(copyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={stylesField(colors).field}>
      <View style={stylesField(colors).fieldLabelRow}>
        <MaterialIcons name={icon} size={16} color={colors.disabled} />
        <Text style={stylesField(colors).fieldLabel}>{label}</Text>
      </View>
      <View style={stylesField(colors).fieldValueRow}>
        <Text style={stylesField(colors).fieldValue} selectable>
          {value}
        </Text>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            onPress={handleCopy}
            style={stylesField(colors).copyButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel={`Copiar ${label}`}
          >
            <MaterialIcons
              name={copied ? 'check' : 'content-copy'}
              size={18}
              color={copied ? colors.primary : colors.disabled}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const stylesField = (colors) => StyleSheet.create({
  field: {
    gap: Spacing.xs,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  fieldLabel: {
    ...Typography.label,
    fontSize: 12,
  },
  fieldValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldValue: {
    ...Typography.body,
    fontSize: 16,
    color: colors.text,
    fontFamily: Fonts.interMedium,
    flex: 1,
  },
  copyButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
});

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
  },

  // ── Header ──────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    ...Typography.h2,
    fontSize: 22,
    color: colors.text,
  },
  totalBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.badge,
  },
  totalBadgeText: {
    ...Typography.priceTotal,
    fontSize: 16,
  },

  // ── Instructions Card ───────────────────────
  instructionsCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: BorderRadius.card,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadows.card,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  instructionsTitle: {
    ...Typography.h3,
    fontSize: 17,
    color: colors.primary,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    marginTop: 1,
  },
  stepNumberText: {
    fontFamily: Fonts.interSemiBold,
    fontSize: 12,
    color: colors.primary,
  },
  stepText: {
    ...Typography.body,
    flex: 1,
    color: colors.bodyColor,
  },

  // ── Details Card ────────────────────────────
  detailsCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: BorderRadius.card,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  detailsTitle: {
    ...Typography.h3,
    fontSize: 17,
    marginBottom: Spacing.md,
    color: colors.text,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginVertical: Spacing.md,
  },

  // ── Payment Field ───────────────────────────
  // Moved to stylesField

  // ── Confirmation & Timer ────────────────────
  confirmationSection: {
    marginBottom: Spacing.lg,
  },
  timerContainer: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.card,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  timerLabel: {
    ...Typography.body,
    color: colors.disabled,
    marginBottom: Spacing.sm,
  },
  timerValue: {
    ...Typography.h1,
    fontSize: 48,
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  timerHint: {
    ...Typography.bodySmall,
    color: colors.text,
    marginTop: Spacing.sm,
    fontFamily: Fonts.interMedium,
  },

  // ── Order Summary ───────────────────────────
  summaryCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: BorderRadius.card,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadows.card,
  },
  summaryTitle: {
    ...Typography.h3,
    fontSize: 17,
    marginBottom: Spacing.md,
    color: colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryItemName: {
    ...Typography.body,
    flex: 1,
    marginRight: Spacing.base,
    color: colors.text,
  },
  summaryItemPrice: {
    ...Typography.price,
    color: colors.primary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginVertical: Spacing.sm,
  },
  summaryTotalLabel: {
    ...Typography.h3,
    fontSize: 16,
    color: colors.text,
  },
  summaryTotalPrice: {
    ...Typography.priceTotal,
    fontSize: 20,
    color: colors.primary,
  },
});
