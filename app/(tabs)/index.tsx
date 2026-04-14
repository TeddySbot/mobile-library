import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  const onboarding = false; 
  if (onboarding) {
    return <Redirect href="/onboarding" />;
  }


  return (
    <ThemedView style={styles.center}>
      <FontAwesome name="book" size={64} color="#A1CEDC" />
      <ThemedText type="title" style={styles.mainTitle}>Index</ThemedText>
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