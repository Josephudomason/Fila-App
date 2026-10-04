import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { ID, Permission, Role, type Models, type RealtimeSubscription } from 'react-native-appwrite';
import { useUser } from '../hooks/useUser';
import { account, databases, realtime } from '../lib/appwrite';

interface BookDocument extends Models.Document {
  title: string;
  author: string;
  description: string;
}

type BookInput = Pick<BookDocument, 'title' | 'author' | 'description'>;

interface booksContextProps {
  books: BookDocument[];
  fetchBooks: () => Promise<void>;
  fetchBookById: (id: string) => Promise<void>;
  createBook: (data: BookInput) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
}

type childProps = {
  children?: ReactNode;
};


const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID ?? '6a9379ae002decbdb46a';
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_BOOKS_COLLECTION_ID ?? 'books';

export const BooksContext = createContext<booksContextProps | undefined>(undefined);

const getUniqueBooks = (documents: BookDocument[]) => (
  Array.from(new Map(documents.map((book) => [book.$id, book])).values())
);

export const BooksProvider = ({ children }: childProps) => {
  const [books, setBooks] = useState<BookDocument[]>([]);
  const { user } = useUser();

  const getAuthenticatedUserId = useCallback(async () => {
    if (user?.$id) return user.$id;

    const currentUser = await account.get();
    return currentUser.$id;
  }, [user?.$id]);

  const fetchBooks = useCallback(async () => {
    try {
      const response = await databases.listDocuments<BookDocument>({
        databaseId: DATABASE_ID,
        collectionId: COLLECTION_ID,
      });

      setBooks(getUniqueBooks(response.documents));
    } catch (error: unknown) {
      console.log(error instanceof Error ? error.message : error);
    }
  }, []);

  async function fetchBookById(id: string) {
    try {
      const book = await databases.getDocument<BookDocument>({
        databaseId: DATABASE_ID,
        collectionId: COLLECTION_ID,
        documentId: id,
      });

      setBooks((currentBooks) => (
        currentBooks.some((item) => item.$id === book.$id)
          ? currentBooks.map((item) => (item.$id === book.$id ? book : item))
          : [book, ...currentBooks]
      ));
    } catch (error: unknown) {
      console.log(error instanceof Error ? error.message : error);
      throw error;
    }
  }

  async function createBook(data: BookInput) {
    try {
      const userId = await getAuthenticatedUserId();

      const newBook = await databases.createDocument<BookDocument>(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        data,
        [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ]
      );

      setBooks((currentBooks) => getUniqueBooks([newBook, ...currentBooks]));
    } catch (error: unknown) {
      console.log(error instanceof Error ? error.message : error);
      throw error;
    }
  }



  async function deleteBook(id: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
      );

      setBooks((currentBooks) => currentBooks.filter((book) => book.$id !== id));
    } catch (error: unknown) {
      console.log(error instanceof Error ? error.message : error);
      throw error;
    }
  }


  useEffect(() => {
    let isCleanedUp = false;
    let subscription: RealtimeSubscription | undefined;
    const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`

    if (user) {
      fetchBooks()

      realtime.subscribe<BookDocument>(channel, (response) => {
        if (isCleanedUp) {
          return;
        }

        const { payload, events } = response

        if (events.some((event) => event.includes('create'))) {
          setBooks((prevBooks) => (
            prevBooks.some((book) => book.$id === payload.$id)
              ? prevBooks
              : [payload, ...prevBooks]
          ))
        }

        if (events.some((event) => event.includes('delete'))) {
          setBooks((prevBooks) => prevBooks.filter((book) => book.$id !== payload.$id))
        }
      })
        .then((nextSubscription) => {
          if (isCleanedUp) {
            return nextSubscription.unsubscribe();
          }

          subscription = nextSubscription;
        })
        .catch((error: unknown) => {
          console.log(error instanceof Error ? error.message : error);
        })
    } else {
      setBooks([])
    }

    return () => {
      isCleanedUp = true;

      if (subscription) {
        subscription.unsubscribe().catch((error: unknown) => {
          console.log(error instanceof Error ? error.message : error);
        })
      }
    }
  }, [fetchBooks, user])


  return (
    <BooksContext.Provider
      value={{
        books,
        fetchBooks,
        fetchBookById,
        createBook,
        deleteBook,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

export default BooksProvider;
