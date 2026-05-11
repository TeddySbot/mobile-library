import { BookList, SavedBook, getLists, removeBookFromList } from '@/utils/library-storage';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from 'react-native';

export default function FavoritesScreen() {
  const router = useRouter();
  const [list, setList] = useState<BookList | null>(null);
  const { width } = useWindowDimensions();
  const posterWidth = (width - 56) / 3;

  useFocusEffect(
    useCallback(() => {
      getLists().then((all) => {
        setList(all.find((l) => l.id === 'to-read') ?? null);
      });
    }, [])
  );

  const handleRemove = (book: SavedBook) => {
    Alert.alert('Retirer', `Retirer "${book.title}" de la liste À voir ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Retirer',
        style: 'destructive',
        onPress: async () => {
          await removeBookFromList('to-read', book.id);
          setList((prev) => (prev ? { ...prev, books: prev.books.filter((b) => b.id !== book.id) } : null));
        },
      },
    ]);
  };

  if (!list) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={list.books}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
              <FontAwesome name="chevron-left" size={16} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.headerTitle}>À voir</Text>
            <View style={{ width: 38 }} />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <FontAwesome name="book" size={48} color="#2A2F45" />
            <Text style={styles.emptyTitle}>Aucun livre dans la liste</Text>
            <Text style={styles.emptySubtitle}>
              Ouvre un livre et ajoute-le à la liste «À voir» pour le retrouver ici.
            </Text>
          </View>
        }
        ListFooterComponent={
          list.books.length > 0 ? (
            <Text style={styles.hint}>Maintenir appuyé pour retirer un livre</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { width: posterWidth }]}
            onPress={() =>
              router.push({
                pathname: '/book/[id]',
                params: {
                  id: item.id,
                  title: item.title,
                  author: item.author,
                  year: item.year,
                  coverUrl: item.coverUrl,
                },
              })
            }
            onLongPress={() => handleRemove(item)}>
            <View style={styles.coverWrapper}>
              {item.coverUrl ? (
                <Image source={{ uri: item.coverUrl }} style={styles.cover} />
              ) : (
                <View style={styles.coverFallback}>
                  <FontAwesome name="book" size={26} color="#B56CFF" />
                </View>
              )}
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.cardMeta} numberOfLines={1}>
              {item.year}
            </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#090B12' },
  content: { paddingHorizontal: 20, paddingBottom: 48 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    paddingBottom: 28,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#171B25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Axiforma-Bold',
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  card: { marginBottom: 2 },
  coverWrapper: {
    aspectRatio: 0.72,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#171B25',
  },
  cover: { width: '100%', height: '100%' },
  coverFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
    marginTop: 8,
  },
  cardMeta: {
    color: '#9AA0B5',
    fontSize: 11,
    lineHeight: 13,
    marginTop: 4,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 14,
  },
  emptyTitle: {
    color: '#6B7285',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: '#3A3F55',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 19,
  },
  hint: {
    color: '#3A3F55',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
});
