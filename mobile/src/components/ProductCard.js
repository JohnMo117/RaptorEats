import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from '../theme';
import QuantityControl from './QuantityControl';
import { useTheme } from '../context/ThemeContext';

/**
 * ProductCard — Menu item card following the Raptor Eats design system.
 *
 * Layout: [Square Image] | [Name + Description + Price] | [Quantity Controls]
 *
 * Props:
 *   - item: { id, name, description, price, image }
 *   - quantity: number
 *   - onIncrease: function
 *   - onDecrease: function
 */
export default function ProductCard({
  item,
  quantity = 0,
  onIncrease,
  onDecrease,
}) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [details, setDetails] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleIncrease = () => {
    if (onIncrease) onIncrease(details);
  };

  const handleDecrease = () => {
    if (onDecrease) onDecrease(details);
  };

  return (
    <View style={styles.card}>
      <View style={styles.mainRow}>
      {/* Product Image */}
      <Image
        source={item.image}
        style={styles.image}
        resizeMode="cover"
        accessibilityLabel={item.name}
      />

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.price}>
          ${item.price.toFixed(2)}
        </Text>
      </View>

      {/* Quantity Controls */}
      <View style={styles.controls}>
        <QuantityControl
          quantity={quantity}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          size="small"
        />
      </View>
      </View>

      {/* Details Toggle / Input */}
      {showDetails ? (
        <TextInput
          style={styles.detailsInput}
          placeholder="Ej. sin cebolla, sin azúcar..."
          placeholderTextColor={colors.disabled}
          value={details}
          onChangeText={setDetails}
          maxLength={100}
        />
      ) : (
        <TouchableOpacity
          style={styles.addDetailsBtn}
          onPress={() => setShowDetails(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.addDetailsText}>+ Añadir detalles</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  card: {
    flexDirection: 'column',
    backgroundColor: colors.surfaceElevated,
    borderRadius: BorderRadius.card,
    padding: Spacing.md,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.sm,
    backgroundColor: colors.surfaceSubtle,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.sm,
    justifyContent: 'center',
  },
  name: {
    ...Typography.h3,
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 2,
    color: colors.bodyColor,
  },
  description: {
    ...Typography.bodySmall,
    color: colors.disabled,
    marginBottom: Spacing.xs,
  },
  price: {
    ...Typography.price,
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  controls: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: Spacing.xs,
  },
  addDetailsBtn: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  addDetailsText: {
    ...Typography.label,
    color: colors.primary,
    fontSize: 13,
  },
  detailsInput: {
    marginTop: Spacing.sm,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    ...Typography.bodySmall,
    color: colors.text,
  },
});
