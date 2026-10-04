import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import ThemedLogo from '../../components/ThemedLogo';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';

export default function Home() {
  return (
    <ThemedView safe className="flex-1 px-6">
      <View className="flex-1 justify-center">
        <View className="items-center gap-6">
          <View className="h-40 w-full max-w-sm items-center justify-center overflow-hidden rounded-lg px-4">
            <ThemedLogo accessibilityLabel="Fila logo" />
          </View>

          <View className="w-full max-w-sm gap-3">
            <ThemedText title className="text-center text-3xl font-bold">
              Build your reading shelf
            </ThemedText>
            <ThemedText className="text-center text-base leading-6">
              Track books, save notes, and keep your next great read close.
            </ThemedText>
          </View>

          <View className="mt-4 w-full max-w-sm gap-3">
            <Link href="/login" asChild>
              <Pressable className="min-h-14 flex-row items-center justify-center gap-2 rounded-lg bg-violet-700 px-5 active:opacity-80">
                <Ionicons name="log-in-outline" size={20} color="#fff" />
                <ThemedText inverse className="text-base font-semibold text-white">
                  Log in
                </ThemedText>
              </Pressable>
            </Link>
            <Link href="/register" asChild>
              <Pressable className="min-h-14 flex-row items-center justify-center gap-2 rounded-lg bg-violet-700 px-5 active:opacity-80">
                <Ionicons name="person-add-outline" size={20} color="#fff" />
                <ThemedText inverse className="text-base font-semibold text-white">
                  Create account
                </ThemedText>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}
