import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TopNavBar, { BOTTOM_NAV_BAR_HEIGHT } from '../components/TopNavBar';
import { Typography, Spacing, Shadows, BorderRadius, IconSize } from '../theme';

/**
 * SettingsScreen — Screen: Ajustes
 *
 * - Allows user to configure account settings, read privacy policy and terms.
 * - Toggle High Contrast mode.
 */
export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();
  const { isHighContrast, toggleHighContrast, colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleNavigate = (tab) => {
    if (tab === 'menu') navigation.navigate('Menu');
    else if (tab === 'cart') navigation.navigate('Cart');
    else if (tab === 'payment') navigation.navigate('Payment');
  };

  const handleLogout = () => {
    logout();
  };

  const OptionItem = ({ icon, label, onPress, rightComponent }) => (
    <TouchableOpacity
      style={[styles.optionItem, { backgroundColor: colors.surfaceElevated, borderBottomColor: colors.cardBorder }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.optionLeft}>
        <MaterialIcons name={icon} size={IconSize.standard} color={colors.primary} />
        <Text style={[styles.optionLabel, { color: colors.text }]}>{label}</Text>
      </View>
      {rightComponent ? rightComponent : (
        <MaterialIcons name="chevron-right" size={IconSize.standard} color={colors.disabled} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceSubtle, paddingTop: insets.top }]}>
      <StatusBar style={isHighContrast ? 'light' : 'dark'} />

      <TopNavBar
        activeTab="settings"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <View style={[styles.header, { backgroundColor: colors.surfaceSubtle }]}>
        <Text style={[styles.title, { color: colors.h1Color }]}>Ajustes</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: BOTTOM_NAV_BAR_HEIGHT + Spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.disabled }]}>Accesibilidad</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder }]}>
            <OptionItem
              icon="brightness-6"
              label="Modo Alto Contraste"
              rightComponent={
                <Switch
                  value={isHighContrast}
                  onValueChange={toggleHighContrast}
                  trackColor={{ false: colors.disabledLight, true: colors.primaryDark }}
                  thumbColor={isHighContrast ? colors.primary : colors.background}
                />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.disabled }]}>Cuenta</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder }]}>
            <OptionItem
              icon="person"
              label="Configuración de Cuenta"
              onPress={() => {}}
            />
            <OptionItem
              icon="support-agent"
              label="Soporte"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.disabled }]}>Legal</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder }]}>
            <OptionItem
              icon="privacy-tip"
              label="Aviso de Privacidad"
              onPress={() => {}}
            />
            <OptionItem
              icon="description"
              label="Términos y Condiciones"
              onPress={() => {}}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  title: {
    ...Typography.h1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.base,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.label,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    borderWidth: 1,
    ...Shadows.card,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    ...Typography.body,
    marginLeft: Spacing.md,
  },
});
