import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { View } from 'react-native';
import ThemedButton from '../../../components/ThemedButton';
import ThemedCard from '../../../components/ThemedCard';
import ThemedText from '../../../components/ThemedText';
import ThemedView from '../../../components/ThemedView';
import { useUser } from '../../../hooks/useUser';

const getErrorMessage = (error: unknown) => (
  error instanceof Error ? error.message : 'Unable to log out. Please try again.'
);

const Profile = () => {
  const { logout, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const email = user?.email ?? 'Reader';
  const initial = email.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      await logout();
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView safe className="flex-1 px-5 py-6">
      <View className="mx-auto w-full max-w-lg flex-1 justify-center gap-5">
        <ThemedCard className="items-center gap-4 rounded-lg p-6">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-violet-700">
            <ThemedText className="text-3xl font-bold text-white">
              {initial}
            </ThemedText>
          </View>

          <View className="items-center gap-1">
            <ThemedText title className="text-center text-2xl font-bold">
              {email}
            </ThemedText>
            <ThemedText className="text-center leading-6">
              Keep building your library one thoughtful read at a time.
            </ThemedText>
          </View>
        </ThemedCard>

        {error && (
          <View className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3">
            <ThemedText className="text-sm font-medium text-rose-700 dark:text-rose-200">
              {error}
            </ThemedText>
          </View>
        )}

        <ThemedButton
          className="min-h-14 flex-row items-center justify-center gap-2 rounded-lg bg-rose-600"
          disabled={loading}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <ThemedText inverse className="text-base font-semibold text-white">
            {loading ? 'Logging out...' : 'Log out'}
          </ThemedText>
        </ThemedButton>
      </View>

    </ThemedView>
  )
}

export default Profile;
