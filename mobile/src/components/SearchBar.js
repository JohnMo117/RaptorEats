import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Colors, Spacing, BorderRadius, Typography } from '../theme';

export default function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  minPrice, 
  onMinPriceChange, 
  maxPrice, 
  onMaxPriceChange 
}) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      {/* Search Input Row */}
      <View style={styles.searchRow}>
        <MaterialIcons name="search" size={24} color={colors.disabled} style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar platillos o ingredientes..."
          placeholderTextColor={colors.disabled}
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearButton}>
            <MaterialIcons name="close" size={20} color={colors.disabled} />
          </TouchableOpacity>
        )}
      </View>

      {/* Price Range Row */}
      <View style={styles.priceRow}>
        <MaterialIcons name="attach-money" size={20} color={colors.disabled} style={styles.icon} />
        <TextInput
          style={styles.priceInput}
          placeholder="Min $"
          placeholderTextColor={colors.disabled}
          value={minPrice}
          onChangeText={onMinPriceChange}
          keyboardType="numeric"
          maxLength={4}
        />
        <TextInput
          style={styles.priceInput}
          placeholder="Max $"
          placeholderTextColor={colors.disabled}
          value={maxPrice}
          onChangeText={onMaxPriceChange}
          keyboardType="numeric"
          maxLength={4}
        />
      </View>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    backgroundColor: colors.surfaceSubtle,
    gap: Spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: BorderRadius.input,
    paddingHorizontal: Spacing.sm,
    height: 44,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  icon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: colors.text,
    height: '100%',
  },
  priceInput: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: BorderRadius.input,
    paddingHorizontal: Spacing.md,
    height: 40,
    ...Typography.body,
    color: colors.text,
    textAlign: 'center',
  },
  clearButton: {
    padding: Spacing.xs,
  },
});
