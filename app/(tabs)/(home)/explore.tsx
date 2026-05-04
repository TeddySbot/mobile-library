import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

type Book = {
  id: string;
  title: string;
  author: string;
  year: string | number;
  coverUrl: string | null;
};

type OpenLibraryDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
};

type OpenLibraryResponse = {
  docs: OpenLibraryDoc[];
};

type Category = {
  id: string;
  title: string;
  subtitle: string;
  searchTerm: string;
  color: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
};

const FALLBACK_QUERY = 'fantasy';
const BOOKS_LIMIT = 9;

const categories: Category[] = [
  {
    id: 'fiction',
    title: 'Fictions',
    subtitle: '532 titles',
    searchTerm: 'fiction',
    color: '#1E66F5',
    icon: 'book',
  },
  {
    id: 'manga',
    title: 'Mangas',
    subtitle: '320 titles',
    searchTerm: 'manga',
    color: '#F97316',
    icon: 'magic',
  },
];

export default function ExploreScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(FALLBACK_QUERY);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const { width } = useWindowDimensions();
  const router = useRouter();

  const posterWidth = (width - 56) / 3;

  const fetchOpenLibraryBooks = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}&limit=${BOOKS_LIMIT}`
      );

      if (!response.ok) {
        throw new Error('Open Library request failed');
      }

      const json: OpenLibraryResponse = await response.json();

      const formattedBooks: Book[] = json.docs.map((book, index) => ({
        id: book.key ?? index.toString(),
        title: book.title ?? 'Untitled',
        author: book.author_name?.[0] ?? 'Unknown author',
        year: book.first_publish_year ?? 'N/A',
        coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
      }));

      setBooks(formattedBooks);
    } catch (fetchError) {
      console.error('Open Library error:', fetchError);
      setBooks([]);
      setError('Unable to load books for this search.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const searchTerm = query.trim() || FALLBACK_QUERY;
      fetchOpenLibraryBooks(searchTerm);
    }, 350);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category.id);
    setQuery(category.searchTerm);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container} lightColor="#090B12" darkColor="#090B12">
        <FlatList
          data={books}
          keyExtractor={(item: Book) => item.id}
          numColumns={3}
          renderItem={({ item }: { item: Book }) => (
            <Pressable
              style={[styles.posterCard, { width: posterWidth }]}
              onPress={() =>
                router.push({
                  pathname: '/book/[id]',
                  params: {
                    id: item.id,
                    title: item.title,
                    author: item.author,
                    year: String(item.year),
                    coverUrl: item.coverUrl ?? '',
                  },
                })
              }>
              <View style={styles.posterImageWrapper}>
                {item.coverUrl ? (
                  <Image source={{ uri: item.coverUrl }} style={styles.posterImage} />
                ) : (
                  <View style={styles.posterFallback}>
                    <FontAwesome name="book" size={26} color="#B56CFF" />
                  </View>
                )}
              </View>

              <ThemedText style={styles.posterTitle} numberOfLines={2}>
                {item.title}
              </ThemedText>
              <ThemedText style={styles.posterMeta} numberOfLines={1}>
                {item.year}
              </ThemedText>
            </Pressable>
          )}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <ThemedText style={styles.sectionLabel}>Search for a content</ThemedText>

              <View style={styles.searchBar}>
                <FontAwesome name="search" size={16} color="#7B8094" />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search for a book..."
                  placeholderTextColor="#676C80"
                  style={styles.searchInput}
                  selectionColor="#B56CFF"
                  autoCapitalize="none"
                />
              </View>

              <ThemedText style={styles.sectionLabel}>Categories.</ThemedText>

              <View style={styles.categoriesRow}>
                {categories.map((category) => (
                  <Pressable
                    key={category.id}
                    onPress={() => handleCategoryPress(category)}
                    style={[
                      styles.categoryCard,
                      { backgroundColor: category.color },
                      selectedCategory === category.id ? styles.categoryCardActive : null,
                    ]}>
                    <View style={styles.categoryTextBlock}>
                      <ThemedText style={styles.categoryTitle}>{category.title}</ThemedText>
                      <ThemedText style={styles.categorySubtitle}>{category.subtitle}</ThemedText>
                    </View>

                    <FontAwesome name={category.icon} size={58} color="rgba(255,255,255,0.24)" style={styles.categoryIcon} />
                  </Pressable>
                ))}
              </View>

              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionLabel}>Most searched.</ThemedText>
                {loading ? <ActivityIndicator size="small" color="#B56CFF" /> : null}
              </View>

              {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
            </>
          }
          ListEmptyComponent={
            !loading ? <ThemedText style={styles.emptyText}>No result for this search.</ThemedText> : null
          }
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090B12',
  },
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  sectionLabel: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 14,
  },
  searchBar: {
    height: 54,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7344C8',
    backgroundColor: '#131620',
    paddingHorizontal: 16,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#9F5EFF',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 14,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryCard: {
    width: '48.5%',
    height: 132,
    borderRadius: 24,
    padding: 16,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  categoryCardActive: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  categoryTextBlock: {
    zIndex: 1,
  },
  categoryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '700',
  },
  categorySubtitle: {
    color: '#F7F7F7',
    fontSize: 12,
    lineHeight: 14,
    opacity: 0.88,
    marginTop: 4,
  },
  categoryIcon: {
    position: 'absolute',
    right: -8,
    bottom: -6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  posterCard: {
    marginBottom: 2,
  },
  posterImageWrapper: {
    aspectRatio: 0.72,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#171B25',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  posterFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
    marginTop: 8,
  },
  posterMeta: {
    color: '#9AA0B5',
    fontSize: 11,
    lineHeight: 13,
    marginTop: 4,
  },
  errorText: {
    color: '#FF8B8B',
    fontSize: 13,
    lineHeight: 17,
    marginBottom: 16,
  },
  emptyText: {
    color: '#A9AEC1',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});
