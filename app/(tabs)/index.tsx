import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('onboarding_done').then((value) => {
      setOnboardingDone(value === 'true');
    });
  }, []);

  if (onboardingDone === null) return null;

  if (!onboardingDone) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <ThemedView style={styles.center}>
      <View style={styles.circle}>
        <FontAwesome name="book" size={32} color="#fff" />
      </View>
      <ThemedText type="title" style={styles.mainTitle}>Bienvenue sur Mobile Library</ThemedText>
      <ThemedText type="default">Explorez des milliers de livres grâce à l'API Open Library.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 40,
    backgroundColor: '#A1CEDC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
  },
});