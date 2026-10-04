import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import ThemeButton from '../../../components/ThemedButton';
import ThemedText from '../../../components/ThemedText';
import ThemedTextInput from '../../../components/ThemedTextInput';
import ThemedView from '../../../components/ThemedView';
import { useUser } from '../../../hooks/useUser';

const getErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message.toLowerCase() : '';

  if (message.includes('invalid credentials') || message.includes('password')) {
    return "We couldn't sign you in with that email and password. Check them and try again.";
  }

  if (message.includes('rate limit') || message.includes('too many')) {
    return 'Too many attempts. Please wait a moment, then try again.';
  }

  if (message.includes('network') || message.includes('fetch')) {
    return "We couldn't reach the server. Check your connection and try again.";
  }

  return 'Something went wrong while signing you in. Please try again.';
};

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useUser();

  const handleSubmit = async () => {
    if (isLoading) return;

    setError(null);
    setIsLoading(true);
    try {
      await login({ email, password })
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ThemedView safe className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-10"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mx-auto w-full max-w-sm gap-6">
            <View className="gap-2">
              <ThemedText title className="text-3xl font-bold">
                Welcome back
              </ThemedText>
              <ThemedText className="text-base leading-6">
                Log in to manage your reading list and notes.
              </ThemedText>
            </View>

            <View className="gap-4">
              <ThemedTextInput
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                className="min-h-14 rounded-lg px-4 text-base"
                inputMode="email"
                keyboardType="email-address"
                placeholder="Email address"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
              />

              <ThemedTextInput
                autoCapitalize="none"
                autoComplete="current-password"
                className="min-h-14 rounded-lg px-4 text-base"
                placeholder="Password"
                secureTextEntry
                textContentType="password"
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
            </View>

            {error && (
              <View className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3">
                <ThemedText className="text-sm font-medium text-rose-700 dark:text-rose-200">
                  {error}
                </ThemedText>
              </View>
            )}

            <ThemeButton
              className="min-h-14 flex-row items-center justify-center gap-2 rounded-lg"
              disabled={isLoading || !email.trim() || !password.trim()}
              onPress={handleSubmit}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="log-in-outline" size={20} color="#fff" />
              )}
              <ThemedText inverse className="text-base font-semibold text-white">
                {isLoading ? 'Logging in...' : 'Log in'}
              </ThemedText>
            </ThemeButton>

            <View className="flex-row justify-center gap-1">
              <ThemedText>New here?</ThemedText>
              <Link href="/register">
                <ThemedText className="font-semibold text-violet-700">
                  Create an account
                </ThemedText>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

export default Login;
