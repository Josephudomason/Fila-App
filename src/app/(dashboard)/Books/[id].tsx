import Ionicons from '@expo/vector-icons/Ionicons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, ScrollView, View, useColorScheme } from 'react-native'
import ThemedButton from '../../../../components/ThemedButton'
import ThemedCard from '../../../../components/ThemedCard'
import ThemedLoader from '../../../../components/ThemedLoader'
import ThemedText from '../../../../components/ThemedText'
import ThemedView from '../../../../components/ThemedView'
import { colors } from '../../../../constants/colors'
import { useBooks } from '../../../../hooks/useBooks'

const isNotFoundError = (error: unknown) => (
  typeof error === 'object'
  && error !== null
  && 'code' in error
  && (error as { code?: number }).code === 404
);

const BookDetails = () => {
  const { id } = useLocalSearchParams();
  const { books, fetchBookById, deleteBook } = useBooks()
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deletionStartedRef = useRef(false);
  const bookId = Array.isArray(id) ? id[0] : id;
  const book = books.find((item) => item.$id === bookId);

  const handleDelete = async () => {
    if (!bookId) {
      return;
    }

    deletionStartedRef.current = true;
    setDeleting(true);
    setError(null);

    try {
      await deleteBook(bookId)
      setShowDeleteConfirmation(false);
      router.replace('/books')
    } catch (error: unknown) {
      if (isNotFoundError(error)) {
        router.replace('/books');
        return;
      }

      deletionStartedRef.current = false;
      setError(error instanceof Error ? error.message : 'Unable to delete this book. Please try again.')
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    if (deletionStartedRef.current || !bookId || book) {
      return;
    }

    void fetchBookById(bookId).catch((fetchError: unknown) => {
      if (isNotFoundError(fetchError)) {
        router.replace('/books');
      }
    });
  }, [book, bookId, fetchBookById])

  if (!book) {
    return (
      <ThemedView safe className="flex-1">
        <ThemedLoader />
      </ThemedView>
    )
  }



  return (
    <ThemedView safe className="flex-1">
      <ScrollView contentContainerClassName="px-5 py-6">
        <View className="mb-4 flex-row items-center justify-between">
          <ThemedButton
            className="h-11 w-11 items-center justify-center rounded-full bg-transparent p-0"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.title} />
          </ThemedButton>
        </View>

        <ThemedCard className="gap-5 rounded-lg p-5">
          <View className="gap-2">
            <ThemedText title className="text-3xl font-bold leading-9">
              {book.title}
            </ThemedText>

            <View className="flex-row items-center gap-2">
              <Ionicons name="person-outline" size={18} color={theme.iconColor} />
              <ThemedText className="text-base">
                Written by {book.author}
              </ThemedText>
            </View>
          </View>

          <View className="h-px bg-violet-700/20" />

          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Ionicons name="reader-outline" size={18} color={colors.primary} />
              <ThemedText title className="text-lg font-bold">
                Description
              </ThemedText>
            </View>
            <ThemedText className="text-base leading-7">
              {book.description}
            </ThemedText>
          </View>

          {error && (
            <View className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3">
              <ThemedText className="text-sm font-medium text-rose-700 dark:text-rose-200">
                {error}
              </ThemedText>
            </View>
          )}

          {showDeleteConfirmation ? (
            <View className="gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4">
              <ThemedText className="font-semibold text-rose-700 dark:text-rose-200">
                Delete this book permanently?
              </ThemedText>
              <View className="flex-row gap-3">
                <ThemedButton
                  className="min-h-12 flex-1 items-center justify-center rounded-lg bg-violet-700"
                  disabled={deleting}
                  onPress={() => setShowDeleteConfirmation(false)}
                >
                  <ThemedText inverse className="font-semibold text-white">Cancel</ThemedText>
                </ThemedButton>
                <ThemedButton
                  className="min-h-12 flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-rose-600"
                  disabled={deleting}
                  onPress={handleDelete}
                >
                  {deleting ? <ActivityIndicator color="#fff" /> : <Ionicons name="trash-outline" size={20} color="#fff" />}
                  <ThemedText inverse className="font-semibold text-white">
                    {deleting ? 'Deleting...' : 'Delete'}
                  </ThemedText>
                </ThemedButton>
              </View>
            </View>
          ) : (
            <ThemedButton
              className="mt-2 min-h-14 flex-row items-center justify-center gap-2 rounded-lg bg-rose-600"
              onPress={() => setShowDeleteConfirmation(true)}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <ThemedText inverse className="text-base font-semibold text-white">
                Delete book
              </ThemedText>
            </ThemedButton>
          )}
        </ThemedCard>
      </ScrollView>
    </ThemedView>
  )
}

export default BookDetails;
