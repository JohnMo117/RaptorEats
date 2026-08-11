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
import { useTheme } from '../context/ThemeContext';
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
  const { login, register } = useAuth();
  const { colors, isHighContrast } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();

  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    if (isRegistering) {
      const result = await register(name, email, password);
      if (!result.success) {
        setError(result.error);
      } else {
        // Auto login on successful register
        const loginResult = await login(email, password);
        if (!loginResult.success) {
          setError(loginResult.error);
        }
      }
    } else {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const isFormValid = isRegistering 
    ? name.trim().length > 0 && email.trim().length > 0 && password.length > 0
    : email.trim().length > 0 && password.length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style={isHighContrast ? "light" : "dark"} />
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
            {isRegistering ? '¡Únete a Raptor Eats!' : '¡Hola! ¿Qué vas a comer hoy?'}
          </Text>
          <Text style={styles.greetingSub}>
            {isRegistering ? 'Crea tu cuenta para empezar.' : 'El menú ya está listo. 🦖'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          
          {/* Name Input (Only on Register) */}
          {isRegistering && (
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="person"
                size={20}
                color={colors.disabled}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                placeholderTextColor={colors.disabled}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="email"
              size={20}
              color={colors.disabled}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor={colors.disabled}
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
              color={colors.disabled}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Contraseña"
              placeholderTextColor={colors.disabled}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={isFormValid ? handleSubmit : undefined}
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
                color={colors.disabled}
              />
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={16} color={colors.alert} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Submit CTA */}
          <CTAButton
            title={isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
            onPress={handleSubmit}
            variant={isFormValid ? 'primary' : 'disabled'}
            disabled={!isFormValid}
            loading={loading}
            style={styles.loginButton}
          />

          {/* Secondary Link */}
          <TouchableOpacity
            style={styles.registerLink}
            activeOpacity={0.7}
            onPress={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
          >
            <Text style={styles.registerText}>
              {isRegistering ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
              <Text style={styles.registerTextBold}>
                {isRegistering ? 'Inicia sesión' : 'Regístrate'}
              </Text>
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

const createStyles = (colors) => StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.disabled,
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
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
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
    color: colors.text,
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
    color: colors.alert,
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
    color: colors.disabled,
    textAlign: 'center',
  },
  registerTextBold: {
    fontFamily: Fonts.interSemiBold,
    color: colors.primary,
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
    backgroundColor: colors.secondary,
    marginBottom: Spacing.sm,
  },
  footerText: {
    ...Typography.bodySmall,
    color: colors.disabledLight,
    fontSize: 12,
  },
});
