import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet } from 'react-native';

export default function OnboardingScreen() {
  const router = useRouter();

  const handleFinish = async () => {
    await AsyncStorage.setItem('onboarding_done', 'true');
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.bottom}>
      <ThemedText type="title">Bienvenue sur Mobile Library</ThemedText>
      <ThemedText type="default">Explorez des milliers de livres grâce à l'API Open Library.</ThemedText>
    <Button 
        title="Commencer" 
        onPress={handleFinish} 
        color="#A1CEDC",
        style={{border-radius: 8;}}
      />
    
    </ThemedView>
    
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    marginBottom: 60,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  mainTitle: {
    marginBottom: 20,
  }
});