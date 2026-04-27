import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import image3 from '../assets/onboarding/0010703188-L.jpg';
import image2 from '../assets/onboarding/0012818414-L.jpg';
import image1 from '../assets/onboarding/963821-L.jpg';


export default function OnboardingScreen() {
  const router = useRouter();

  const handleFinish = async () => {
    await AsyncStorage.setItem('onboarding_done', 'true');
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.mainContainer}>
      <ThemedView style={styles.imageContainer}>
        <ThemedView style={styles.skewCard}>
          <Image source={image1} style={styles.skewImage} resizeMode="cover" />
        </ThemedView>
        <ThemedView style={styles.skewCard}>
          <Image source={image2} style={styles.skewImage} resizeMode="cover" />
        </ThemedView>
        <ThemedView style={styles.skewCard}>
          <Image source={image3} style={styles.skewImage} resizeMode="cover" />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.textContainer}>
        <ThemedText type="title" style={styles.textCenter}>Bienvenue sur Mobile Library</ThemedText>
        <ThemedText type="default" style={styles.textCenter}>
          Explorez des milliers de livres grâce à l'API Open Library.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.bottomContainer}>
        <TouchableOpacity style={styles.customButton} onPress={handleFinish}>
          <ThemedText style={styles.buttonText}>Commencer</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  imageContainer: {
    marginTop: 60, 
    alignItems: 'center',
    gap: 10,
    zIndex: 1, 
  },
  skewCard: {
    width: '140%',
    height: 120,
    overflow: 'hidden',
    transform: [{ rotate: '-12deg' }],
  },
  skewImage: {
    width: '100%',
    height: 180,
    transform: [{ rotate: '12deg' }, { scale: 1.4 }],
    top: -30,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  textCenter: {
    textAlign: 'center',
    fontFamily: 'Axiforma-Bold',
    color: '#FFFFFF',
  },
  bottomContainer: {
    paddingBottom: 60,
    alignItems: 'center',
  },
  customButton: {
    width: '80%',
    maxWidth: 300,
    height: 55,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#00FFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00FFFF',
  },
});