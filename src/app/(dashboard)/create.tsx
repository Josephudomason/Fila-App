import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useBooks } from '../../../hooks/useBooks';

import ThemedButton from '../../../components/ThemedButton';
import ThemedText from '../../../components/ThemedText';
import ThemedTextInput from '../../../components/ThemedTextInput';
import ThemedView from '../../../components/ThemedView';

const getErrorMessage = (error: unknown) => (
  error instanceof Error ? error.message : 'Unable to create this book. Please try again.'
);

const Create = () => {
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { createBook } = useBooks();
  const router = useRouter();
  const canSubmit = Boolean(title.trim() && author.trim() && description.trim() && !loading);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      await createBook({
        title: title.trim(),
        author: author.trim(),
        description: description.trim(),
      });

      // reset field
      setTitle('');
      setAuthor('');
      setDescription('');

      //redirect
      router.replace('/books');
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      //reset loading state
      setLoading(false);
    }
  }

  return (
    <ThemedView safe className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow px-5 py-6"
          keyboardShouldPersistTaps="handled"
        >

          <View className="mx-auto w-full max-w-lg flex-1 justify-center gap-6">
            <View className="gap-2">
              <ThemedText title className="text-3xl font-bold">
                Add a book
              </ThemedText>
              <ThemedText className="text-base leading-6">
                Capture the details now so your reading list stays useful later.
              </ThemedText>
            </View>

            <View className="gap-4">
              <ThemedTextInput
                className="min-h-14 rounded-lg px-4 text-base"
                placeholder="Book title"
                returnKeyType="next"
                value={title}
                onChangeText={setTitle}
              />

              <ThemedTextInput
                className="min-h-14 rounded-lg px-4 text-base"
                placeholder="Author"
                returnKeyType="next"
                value={author}
                onChangeText={setAuthor}
              />

              <ThemedTextInput
                className="min-h-32 rounded-lg px-4 py-4 text-base"
                multiline
                placeholder="Description"
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {error && (
              <View className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3">
                <ThemedText className="text-sm font-medium text-rose-700 dark:text-rose-200">
                  {error}
                </ThemedText>
              </View>
            )}

            <ThemedButton
              className="min-h-14 flex-row items-center justify-center gap-2 rounded-lg"
              disabled={!canSubmit}
              onPress={handleSubmit}
            >
              <Ionicons name={loading ? 'hourglass-outline' : 'add-circle-outline'} size={20} color="#fff" />
              <ThemedText inverse className="text-base font-semibold text-white">
                {loading ? 'Saving...' : 'Create book'}
              </ThemedText>
            </ThemedButton>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

export default Create;
