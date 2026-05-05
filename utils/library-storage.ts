import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'book_lists_v1';

export type SavedBook = {
  id: string;
  title: string;
  author: string;
  year: string;
  coverUrl: string;
};

export type BookList = {
  id: string;
  title: string;
  isDefault: boolean;
  books: SavedBook[];
};

const DEFAULT_LISTS: BookList[] = [
  { id: 'to-read', title: 'À voir', isDefault: true, books: [] },
  { id: 'reading', title: 'En cours', isDefault: true, books: [] },
  { id: 'finished', title: 'Terminé', isDefault: true, books: [] },
];

export async function getLists(): Promise<BookList[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LISTS));
      return DEFAULT_LISTS;
    }
    return JSON.parse(raw) as BookList[];
  } catch {
    return DEFAULT_LISTS;
  }
}

async function saveLists(lists: BookList[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

export async function createList(title: string): Promise<BookList[]> {
  const lists = await getLists();
  const newList: BookList = {
    id: `custom-${Date.now()}`,
    title: title.trim(),
    isDefault: false,
    books: [],
  };
  const updated = [...lists, newList];
  await saveLists(updated);
  return updated;
}

export async function deleteList(listId: string): Promise<BookList[]> {
  const lists = await getLists();
  const updated = lists.filter((l) => l.id !== listId);
  await saveLists(updated);
  return updated;
}

export async function toggleBookInList(listId: string, book: SavedBook): Promise<boolean> {
  const lists = await getLists();
  const list = lists.find((l) => l.id === listId);
  const isInList = list?.books.some((b) => b.id === book.id) ?? false;
  const updated = lists.map((l) => {
    if (l.id !== listId) return l;
    if (isInList) return { ...l, books: l.books.filter((b) => b.id !== book.id) };
    return { ...l, books: [...l.books, book] };
  });
  await saveLists(updated);
  return !isInList;
}

export async function removeBookFromList(listId: string, bookId: string): Promise<void> {
  const lists = await getLists();
  const updated = lists.map((l) => {
    if (l.id !== listId) return l;
    return { ...l, books: l.books.filter((b) => b.id !== bookId) };
  });
  await saveLists(updated);
}
