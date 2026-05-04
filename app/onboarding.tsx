import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Bienvenue sur Mobile Library',
    description: "Explorez des milliers de livres grâce à l'API Open Library.",
    images: [require('../assets/onboarding/963821-L.jpg'), require('../assets/onboarding/0012818414-L.jpg'), require('../assets/onboarding/0010703188-L.jpg')],
    fullScreen: false,
  },
  {
    id: '2',
    title: 'Créez votre collection',
    description: 'Enregistrez vos livres favoris et suivez vos lectures en un clic.',
    images: [require('../assets/onboarding/tag-couvertures-livres-1.jpg')],
    fullScreen: true,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const id = scrollX.addListener(({ value }) => {
      const progress = value / width;
      const newIndex = SLIDES.findIndex((_, i) => 1 - Math.abs(progress - i) > 0.51);
      if (newIndex !== -1) {
        currentIndexRef.current = newIndex;
        setCurrentIndex(newIndex);
      }
    });
    return () => scrollX.removeListener(id);
  }, []);

  const handleFinish = async () => {
    await AsyncStorage.setItem('onboarding_done', 'true');
    router.replace('/(tabs)');
  };

  const handleNext = () => {
    const idx = currentIndexRef.current;
    if (idx < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: idx + 1, animated: true });
    } else {
      handleFinish();
    }
  };

  const renderSlide = ({ item, index }: { item: (typeof SLIDES)[0]; index: number }) => {
    const overlayOpacity = scrollX.interpolate({
      inputRange: [
        (index - 0.51) * width,
        (index - 0.49) * width,
        (index + 0.49) * width,
        (index + 0.51) * width,
      ],
      outputRange: [1, 0, 0, 1],
      extrapolate: 'clamp',
    });

    if (item.fullScreen) {
      return (
        <View style={styles.slide}>
          <Image source={item.images[0]} style={styles.fullScreenImage} resizeMode="cover" />
          <Animated.View style={[styles.slideOverlay, { opacity: overlayOpacity }]} />
        </View>
      );
    }

    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          {item.images.map((img, i) => (
            <View key={i} style={styles.skewCard}>
              <Image source={img} style={styles.skewImage} resizeMode="cover" />
            </View>
          ))}
        </View>
        <View style={styles.textContainer}>
          <ThemedText type="title" style={styles.textCenter}>{item.title}</ThemedText>
          <ThemedText type="default" style={styles.textCenter}>{item.description}</ThemedText>
        </View>
        <Animated.View style={[styles.slideOverlay, { opacity: overlayOpacity }]} />
      </View>
    );
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <ThemedView style={styles.mainContainer}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        style={styles.flatList}
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
        <TouchableOpacity style={styles.customButton} onPress={handleNext}>
          <ThemedText style={styles.buttonText}>{isLastSlide ? 'Commencer' : 'Suivant'}</ThemedText>
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
  flatList: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
    overflow: 'hidden',
  },
  slideOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  fullScreenImage: {
    flex: 1,
    width: width,
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
    backgroundColor: '#555',
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
