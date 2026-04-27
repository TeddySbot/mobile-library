import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Tes données de slides
const SLIDES = [
  {
    id: '1',
    title: 'Bienvenue sur Mobile Library',
    description: "Explorez des milliers de livres grâce à l'API Open Library.",
    images: [require('../assets/onboarding/963821-L.jpg'), require('../assets/onboarding/0012818414-L.jpg'), require('../assets/onboarding/0010703188-L.jpg')]
  },
  {
    id: '2',
    title: 'Créez votre collection',
    description: 'Enregistrez vos livres favoris et suivez vos lectures en un clic.',
    images: [require('../assets/onboarding/0012818414-L.jpg'), require('../assets/onboarding/963821-L.jpg'), require('../assets/onboarding/0010703188-L.jpg')]
  }
];


export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / width);
    setCurrentIndex(index);
  };

  const handleFinish = async () => {
    await AsyncStorage.setItem('onboarding_done', 'true');
    router.replace('/(tabs)');
  };

  const renderSlide = ({ item }: any) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        {item.images.map((img: any, index: number) => (
          <View key={index} style={styles.skewCard}>
            <Image source={img} style={styles.skewImage} resizeMode="cover" />
          </View>
        ))}
      </View>

      <View style={styles.textContainer}>
        <ThemedText type="title" style={styles.textCenter}>{item.title}</ThemedText>
        <ThemedText type="default" style={styles.textCenter}>{item.description}</ThemedText>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.mainContainer}>
      <FlatList
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll} // Utilisation du scroll pour les points
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.pagination}>
        {SLIDES.map((_, index) => (
          <View 
            key={index} 
            style={[styles.dot, currentIndex === index ? styles.activeDot : styles.inactiveDot]} 
          />
        ))}
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.customButton} onPress={handleFinish}>
          <ThemedText style={styles.buttonText}>Commencer</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  slide: {
    width: width,
    flex: 1,
    overflow: 'hidden', 
  },
  imageContainer: {
    height: width * 0.9, 
    marginTop: 110,
    alignItems: 'center',
    gap: 8,
  },
  skewCard: {
    width: '140%',
    height: 100,
    overflow: 'hidden',
    transform: [{ rotate: '-12deg' }],
  },
  skewImage: {
    width: '100%',
    height: 160,
    transform: [{ rotate: '12deg' }, { scale: 1.4 }],
    top: -25,
  },
  textContainer: {
    marginTop: 20, 
    paddingHorizontal: 40,
    alignItems: 'center',
    gap: 10,
  },
  textCenter: {
    textAlign: 'center',
    fontFamily: 'Axiforma-Bold',
    color: '#FFFFFF',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 22,
    backgroundColor: '#00FFFF',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#333',
  },
  bottomContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  customButton: {
    width: 250,
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