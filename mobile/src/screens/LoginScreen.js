import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Colors,
  Typography,
  Fonts,
  Spacing,
  BorderRadius,
} from '../theme';
import { useAuth } from '../context/AuthContext';
import CTAButton from '../components/CTAButton';

/**
 * LoginScreen — Screen 1: Auth
 *
 * - Centered Raptor Eats logo
 * - Brand greeting in Spanish
 * - Email & Password inputs
 * - "Iniciar sesión" CTA button
 */
export default function LoginScreen() {
  const { login } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError('');
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error);
      }
      setLoading(false);
    }, 800);
  };

  const isFormValid = email.trim().length > 0 && password.length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.xxl, paddingBottom: insets.bottom + Spacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Raptor Eats logo"
          />
        </View>

        {/* Brand Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            ¡Hola! ¿Qué vas a comer hoy?
          </Text>
          <Text style={styles.greetingSub}>
            El menú ya está listo. 🦖
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="email"
              size={20}
              color={Colors.disabled}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor={Colors.disabled}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
              accessibilityLabel="Correo electrónico"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="lock"
              size={20}
              color={Colors.disabled}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Contraseña"
              placeholderTextColor={Colors.disabled}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={isFormValid ? handleLogin : undefined}
              accessibilityLabel="Contraseña"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              <MaterialIcons
                name={showPassword ? 'visibility-off' : 'visibility'}
                size={20}
                color={Colors.disabled}
              />
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={16} color={Colors.alert} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Login CTA */}
          <CTAButton
            title="Iniciar sesión"
            onPress={handleLogin}
            variant={isFormValid ? 'primary' : 'disabled'}
            disabled={!isFormValid}
            loading={loading}
            style={styles.loginButton}
          />

          {/* Secondary Link */}
          <TouchableOpacity
            style={styles.registerLink}
            activeOpacity={0.7}
            accessibilityRole="link"
            accessibilityLabel="Crear cuenta nueva"
          >
            <Text style={styles.registerText}>
              ¿No tienes cuenta?{' '}
              <Text style={styles.registerTextBold}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Decorative Footer */}
        <View style={styles.footer}>
          <View style={styles.footerAccent} />
          <Text style={styles.footerText}>Raptor Eats © 2025</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },

  // ── Logo ────────────────────────────────────
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 160,
    height: 160,
  },

  // ── Greeting ────────────────────────────────
  greetingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  greeting: {
    ...Typography.h1,
    fontSize: 26,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  greetingSub: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.disabled,
    textAlign: 'center',
  },

  // ── Form ────────────────────────────────────
  form: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: BorderRadius.input,
    marginBottom: Spacing.base,
    paddingHorizontal: Spacing.md,
    minHeight: 52,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.interRegular,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: Spacing.md,
  },
  passwordInput: {
    paddingRight: Spacing.xxxl,
  },
  eyeButton: {
    position: 'absolute',
    right: Spacing.md,
    padding: Spacing.xs,
  },

  // ── Error ───────────────────────────────────
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
    gap: Spacing.xs,
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.alert,
    flex: 1,
  },

  // ── Button ──────────────────────────────────
  loginButton: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  // ── Register Link ───────────────────────────
  registerLink: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  registerText: {
    ...Typography.body,
    color: Colors.disabled,
    textAlign: 'center',
  },
  registerTextBold: {
    fontFamily: Fonts.interSemiBold,
    color: Colors.primary,
  },

  // ── Footer ──────────────────────────────────
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: Spacing.xxl,
  },
  footerAccent: {
    width: 40,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.secondary,
    marginBottom: Spacing.sm,
  },
  footerText: {
    ...Typography.bodySmall,
    color: Colors.disabledLight,
    fontSize: 12,
  },
});
