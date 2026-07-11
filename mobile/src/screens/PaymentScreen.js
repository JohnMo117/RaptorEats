import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Platform,
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
import { PAYMENT_INFO, PAYMENT_INSTRUCTIONS, WHATSAPP_CONFIG } from '../data/paymentData';
import TopNavBar from '../components/TopNavBar';
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

  const handleNavigate = useCallback(
    (tab) => {
      if (tab === 'menu') navigation.navigate('Menu');
      else if (tab === 'cart') navigation.navigate('Cart');
    },
    [navigation]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleSendWhatsApp = useCallback(async () => {
    const message = WHATSAPP_CONFIG.getMessage(totalPrice, items);
    const url = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${message}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch (err) {
      // TODO(security): Use framework-native modal for error display
      // instead of alert(). For prototype, we silently handle.
    }
  }, [totalPrice, items]);

  const handleCopyToClipboard = useCallback(async (text) => {
    await Clipboard.setStringAsync(text);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Navigation */}
      <TopNavBar
        activeTab="payment"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xxl },
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
            <MaterialIcons name="info" size={22} color={Colors.primary} />
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
          />

          <View style={styles.fieldDivider} />

          <PaymentField
            label="Número de tarjeta"
            value={PAYMENT_INFO.cardNumber}
            copyValue={PAYMENT_INFO.cardNumberFull}
            onCopy={handleCopyToClipboard}
            icon="credit-card"
          />

          <View style={styles.fieldDivider} />

          <PaymentField
            label="Número interbancario (CLABE)"
            value={PAYMENT_INFO.clabe}
            copyValue={PAYMENT_INFO.clabeFull}
            onCopy={handleCopyToClipboard}
            icon="account-balance"
          />

          <View style={styles.fieldDivider} />

          <PaymentField
            label="Banco"
            value={PAYMENT_INFO.bankName}
            copyValue={PAYMENT_INFO.bankName}
            onCopy={handleCopyToClipboard}
            icon="business"
          />
        </View>

        {/* WhatsApp CTA */}
        <View style={styles.whatsappSection}>
          <CTAButton
            title="Enviar comprobante"
            onPress={handleSendWhatsApp}
            variant="whatsapp"
            icon={
              <MaterialIcons
                name="chat"
                size={22}
                color={Colors.background}
              />
            }
          />
          <Text style={styles.whatsappHint}>
            Se abrirá WhatsApp con los datos de tu pedido.
          </Text>
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
function PaymentField({ label, value, copyValue, onCopy, icon }) {
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
    <View style={styles.field}>
      <View style={styles.fieldLabelRow}>
        <MaterialIcons name={icon} size={16} color={Colors.disabled} />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <View style={styles.fieldValueRow}>
        <Text style={styles.fieldValue} selectable>
          {value}
        </Text>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            onPress={handleCopy}
            style={styles.copyButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel={`Copiar ${label}`}
          >
            <MaterialIcons
              name={copied ? 'check' : 'content-copy'}
              size={18}
              color={copied ? Colors.primary : Colors.disabled}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
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
  },
  totalBadge: {
    backgroundColor: Colors.primaryLight,
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
    backgroundColor: Colors.surfaceElevated,
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
    color: Colors.primary,
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
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    marginTop: 1,
  },
  stepNumberText: {
    fontFamily: Fonts.interSemiBold,
    fontSize: 12,
    color: Colors.primary,
  },
  stepText: {
    ...Typography.body,
    flex: 1,
    color: Colors.bodyColor,
  },

  // ── Details Card ────────────────────────────
  detailsCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.card,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  detailsTitle: {
    ...Typography.h3,
    fontSize: 17,
    marginBottom: Spacing.md,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: Spacing.md,
  },

  // ── Payment Field ───────────────────────────
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
    color: Colors.text,
    fontFamily: Fonts.interMedium,
    flex: 1,
  },
  copyButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },

  // ── WhatsApp ────────────────────────────────
  whatsappSection: {
    marginBottom: Spacing.lg,
  },
  whatsappHint: {
    ...Typography.bodySmall,
    color: Colors.disabled,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },

  // ── Order Summary ───────────────────────────
  summaryCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.card,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadows.card,
  },
  summaryTitle: {
    ...Typography.h3,
    fontSize: 17,
    marginBottom: Spacing.md,
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
  },
  summaryItemPrice: {
    ...Typography.price,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: Spacing.sm,
  },
  summaryTotalLabel: {
    ...Typography.h3,
    fontSize: 16,
  },
  summaryTotalPrice: {
    ...Typography.priceTotal,
    fontSize: 20,
  },
});
