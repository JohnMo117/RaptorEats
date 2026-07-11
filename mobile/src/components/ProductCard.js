import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from '../theme';
import QuantityControl from './QuantityControl';

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
  return (
    <View style={styles.card}>
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
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          size="small"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.card,
    padding: Spacing.md,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceSubtle,
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
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.disabled,
    marginBottom: Spacing.xs,
  },
  price: {
    ...Typography.price,
    fontSize: 15,
    fontWeight: '600',
  },
  controls: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: Spacing.xs,
  },
});
