import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

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
      <FontAwesome name="book" size={64} color="#A1CEDC" />
      <ThemedText type="title" style={styles.mainTitle}>Index</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
});