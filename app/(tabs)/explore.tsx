import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

export default function ExploreScreen() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOpenLibraryBooks = async () => {
    try {
      const response = await fetch('https://openlibrary.org/search.json?q=library&limit=3');
      const json = await response.json();
      
      const formattedBooks = json.docs.map((book, index) => ({
        id: book.key || index.toString(),
        title: book.title,
        author: book.author_name ? book.author_name[0] : 'Auteur inconnu',
        year: book.first_publish_year || 'N/C'
      }));

      setBooks(formattedBooks);
    } catch (error) {
      console.error("Erreur API :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenLibraryBooks();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color="#A1CEDC" />
        <ThemedText>Connexion à Open Library...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.mainTitle}>Open Library API</ThemedText>
      
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.bookCard}>
            <View style={styles.iconContainer}>
               <FontAwesome name="book" size={24} color="#A1CEDC" />
            </View>
            <View style={styles.textContainer}>
              <ThemedText style={styles.bookTitle} numberOfLines={1}>{item.title}</ThemedText>
              <ThemedText style={styles.bookAuthor}>{item.author}</ThemedText>
              <ThemedText style={styles.bookYear}>Publié en : {item.year}</ThemedText>
            </View>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
  },
  bookCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f0f0f015',
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff10',
  },
  iconContainer: {
    width: 40,
  },
  textContainer: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#A1CEDC',
  },
  bookYear: {
    fontSize: 12,
    opacity: 0.5,
  },
});