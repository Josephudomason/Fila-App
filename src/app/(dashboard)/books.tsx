import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, useColorScheme, View } from 'react-native';
import ThemedCard from '../../../components/ThemedCard';
import ThemedText from '../../../components/ThemedText';
import ThemedView from '../../../components/ThemedView';
import { colors } from '../../../constants/colors';
import { useBooks } from '../../../hooks/useBooks';

const Books = () => {

  const { books, fetchBooks } = useBooks()
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await fetchBooks();
    } finally {
      setRefreshing(false);
    }
  }


  return (
    <ThemedView className="flex-1" safe>
      <View className="px-5 pb-3 pt-2">
        <ThemedText title className="text-3xl font-bold">
          Library
        </ThemedText>
        <ThemedText className="mt-1 text-base">
          {books.length} {books.length === 1 ? 'book' : 'books'} in your reading list
        </ThemedText>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="gap-3 px-5 pb-8"
        refreshControl={(
          <RefreshControl
            tintColor={theme.iconColorFocused}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
        ListEmptyComponent={(
          <ThemedCard className="mt-8 items-center gap-3 rounded-lg p-6">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-violet-700/10">
              <Ionicons name="book-outline" size={28} color={colors.primary} />
            </View>
            <ThemedText title className="text-center text-xl font-bold">
              No books yet
            </ThemedText>
            <ThemedText className="text-center leading-6">
              Add your first book and keep your reading queue organized.
            </ThemedText>
          </ThemedCard>
        )}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/Books/[id]', params: { id: item.$id } })}
            className="active:opacity-80">
            <ThemedCard className="rounded-lg border-l-4 border-violet-700 p-4">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 gap-1">
                  <ThemedText title className="text-xl font-bold">
                    {item.title}
                  </ThemedText>
                  <ThemedText className="text-sm">
                    Written by {item.author}
                  </ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={22} color={theme.iconColor} />
              </View>
            </ThemedCard>
          </Pressable>
        )}
      />
    </ThemedView>
  )
}

export default Books;
