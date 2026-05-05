import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type OpenLibraryDoc = {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  ratings_average?: number;
  want_to_read_count?: number;
};

type FeedTab = {
  label: 'For you' | 'Popular' | 'Trending' | 'Recent';
  query: string;
};

const API_BASE_URL = 'https://openlibrary.org/search.json';
const FALLBACK_COVER = 'https://via.placeholder.com/300x450/1b1f2a/e9ebf3?text=No+Cover';
const FEED_TABS: FeedTab[] = [
  { label: 'For you', query: 'fantasy' },
  { label: 'Popular', query: 'best+sellers' },
  { label: 'Trending', query: 'new+release' },
  { label: 'Recent', query: '2024' },
];

function coverUrl(coverId?: number, size: 'S' | 'M' | 'L' = 'L') {
  if (!coverId) return FALLBACK_COVER;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

function formatAuthor(book: OpenLibraryDoc) {
  return book.author_name?.[0] ?? 'Unknown author';
}

function getRatingValue(book: OpenLibraryDoc) {
  if (book.ratings_average && Number.isFinite(book.ratings_average)) {
    return Math.min(5, Math.max(0, book.ratings_average));
  }
  return 4.2;
}

export default function HomeScreen() {
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredBooks, setFeaturedBooks] = useState<OpenLibraryDoc[]>([]);
  const [continueBooks, setContinueBooks] = useState<OpenLibraryDoc[]>([]);
  const [forYouBooks, setForYouBooks] = useState<OpenLibraryDoc[]>([]);
  const [selectedTab, setSelectedTab] = useState<FeedTab['label']>('For you');
  const [tabLoading, setTabLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const username = 'Moi';

  useEffect(() => {
    AsyncStorage.getItem('onboarding_done').then((value) => {
      setOnboardingDone(value === 'true');
    });
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      try {
        const [featuredRes, continueRes, forYouRes] = await Promise.all([
          fetch(`${API_BASE_URL}?q=new+release&limit=10`, { signal: controller.signal }),
          fetch(`${API_BASE_URL}?q=action&limit=15`, { signal: controller.signal }),
          fetch(`${API_BASE_URL}?q=fantasy&limit=15`, { signal: controller.signal }),
        ]);

        const [featuredJson, continueJson, forYouJson] = await Promise.all([
          featuredRes.json(),
          continueRes.json(),
          forYouRes.json(),
        ]);

        setFeaturedBooks((featuredJson.docs ?? []).slice(0, 5));
        setContinueBooks((continueJson.docs ?? []).slice(0, 10));
        setForYouBooks((forYouJson.docs ?? []).slice(0, 10));
      } catch {
        setFeaturedBooks([]);
        setContinueBooks([]);
        setForYouBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadTabBooks = async () => {
      const selected = FEED_TABS.find((tab) => tab.label === selectedTab);
      if (!selected) return;

      setTabLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}?q=${selected.query}&limit=20`, {
          signal: controller.signal,
        });
        const json = await response.json();
        setForYouBooks((json.docs ?? []).slice(0, 8));
      } catch {
        setForYouBooks([]);
      } finally {
        setTabLoading(false);
      }
    };

    loadTabBooks();

    return () => {
      controller.abort();
    };
  }, [selectedTab]);

  const router = useRouter();
  const heroBook = featuredBooks[0];

  const navigateToBook = (book: OpenLibraryDoc) => {
    router.push({
      pathname: '/book/[id]',
      params: {
        id: book.key,
        title: book.title,
        author: formatAuthor(book),
        year: String(book.first_publish_year ?? 'N/A'),
        coverUrl: coverUrl(book.cover_i, 'M'),
      },
    });
  };

  if (onboardingDone === null) return null;

  if (!onboardingDone) {
    return <Redirect href="/onboarding" />;
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4d03f" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: coverUrl(continueBooks[0]?.cover_i, 'S') }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.greeting}>
              <Text style={styles.greet}>Welcome back</Text>
              <Text style={styles.name}>{username}</Text>
            </View>
          </View>
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuButton} 
              activeOpacity={0.7}
              onPress={() => setMenuOpen(!menuOpen)}
            >
              <FontAwesome name="bars" size={22} color="#f2f4f8" />
            </TouchableOpacity>
            
            {menuOpen && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); /* Action */ }}>
                  <FontAwesome name="user" size={16} color="#f2f4f8" />
                  <Text style={styles.menuItemText}>Mon profil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); /* Action */ }}>
                  <FontAwesome name="heart" size={16} color="#f2f4f8" />
                  <Text style={styles.menuItemText}>Favoris</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); /* Action */ }}>
                  <FontAwesome name="cog" size={16} color="#f2f4f8" />
                  <Text style={styles.menuItemText}>Paramètres</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); /* Action */ }}>
                  <FontAwesome name="sign-out" size={16} color="#f2f4f8" />
                  <Text style={styles.menuItemText}>Déconnexion</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>New release.</Text>

        {heroBook ? (
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigateToBook(heroBook)} style={styles.heroCard}>
            <Image source={{ uri: coverUrl(heroBook.cover_i, 'L') }} style={styles.heroImage} resizeMode="cover" />
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle} numberOfLines={1}>
                {heroBook.title}
              </Text>
              <View style={styles.heroMetaRow}>
                <Text style={styles.heroAuthor} numberOfLines={1}>
                  {formatAuthor(heroBook)}
                </Text>
                <Text style={styles.heroRating}>★★★★★ {Math.round(getRatingValue(heroBook) * 60)} users</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <Text style={styles.emptyState}>Aucune sortie trouvée.</Text>
        )}

        <Text style={styles.sectionTitle}>Continue Reading.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rowList}>
          {continueBooks.slice(0, 5).map((book) => (
            <TouchableOpacity
              key={book.key}
              activeOpacity={0.8}
              onPress={() => navigateToBook(book)}
              style={styles.smallCard}>
              <Image source={{ uri: coverUrl(book.cover_i, 'M') }} style={styles.smallCardImage} resizeMode="cover" />
              <Text style={styles.smallCardTitle} numberOfLines={1}>
                {book.title}
              </Text>
              <Text style={styles.smallCardMeta} numberOfLines={1}>
                T.{Math.max(1, (book.first_publish_year ?? 2020) % 10)} Episode {Math.max(1, (book.want_to_read_count ?? 12) % 12)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.tabRow}>
          {FEED_TABS.map((tab) => {
            const isActive = tab.label === selectedTab;

            return (
              <TouchableOpacity key={tab.label} onPress={() => setSelectedTab(tab.label)} activeOpacity={0.8}>
                <Text style={isActive ? styles.tabActive : styles.tabItem}>
                  {isActive ? `• ${tab.label}` : tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {tabLoading ? (
          <View style={styles.tabLoadingRow}>
            <ActivityIndicator size="small" color="#f4d03f" />
          </View>
        ) : null}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rowList}>
          {forYouBooks.slice(0, 8).map((book) => (
            <TouchableOpacity
              key={book.key}
              activeOpacity={0.8}
              onPress={() => navigateToBook(book)}
              style={styles.posterCard}>
              <Image source={{ uri: coverUrl(book.cover_i, 'M') }} style={styles.posterImage} resizeMode="cover" />
              <Text style={styles.posterTitle} numberOfLines={1}>
                {book.title}
              </Text>
              <Text style={styles.posterYear}>{book.first_publish_year ?? 2022}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#10131d',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#10131d',
  },
  content: {
    flex: 1,
    marginTop: 20,
    paddingTop: 46,
    paddingBottom: 12,
    paddingHorizontal: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#2db8ff',
  },
  greeting: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 2,
  },
  greet: {
    color: '#f0f2f8',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Axiforma-Bold',
  },
  name: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Axiforma-Bold',
  },
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a3242',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#1a1e2a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a3242',
    paddingVertical: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    zIndex: 2,
  },
  menuItemText: {
    color: '#f2f4f8',
    fontSize: 14,
    fontFamily: 'Axiforma-Bold',
    zIndex: 2,
  },
  sectionTitle: {
    color: '#f5f7fb',
    fontSize: 19,
    marginBottom: 8,
    fontFamily: 'Axiforma-Bold',
  },
  heroCard: {
    width: '95%',
    height: 160,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
    marginHorizontal: '2.5%',
    backgroundColor: '#1c2230',
    zIndex: 0,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(10, 12, 18, 0.38)',
    zIndex: 0,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Axiforma-Bold',
    zIndex: 0,
  },
  heroMetaRow: {
    marginTop: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
  },
  heroAuthor: {
    color: '#c5ccdb',
    fontSize: 11,
    maxWidth: '56%',
    zIndex: 0,
  },
  heroRating: {
    color: '#f4d03f',
    fontSize: 11,
    fontWeight: '600',
    zIndex: 0,
  },
  rowList: {
    paddingRight: 12,
  },
  smallCard: {
    width: 104,
    marginRight: 10,
    marginBottom: 10,
  },
  smallCardImage: {
    width: '95%',
    height: 145,
    borderRadius: 10,
    marginBottom: 4,
    marginHorizontal: '2.5%',
    backgroundColor: '#1c2230',
  },
  smallCardTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 1,
    fontFamily: 'Axiforma-Bold',
  },
  smallCardMeta: {
    color: '#8e97ab',
    fontSize: 10,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  tabHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  tabActive: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Axiforma-Bold',
  },
  tabItem: {
    color: '#6d7384',
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Axiforma-Bold',
  },
  tabLoadingRow: {
    height: 20,
    marginBottom: 6,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  posterCard: {
    width: 84,
    marginRight: 10,
  },
  posterImage: {
    width: '95%',
    height: 100,
    borderRadius: 10,
    marginBottom: 4,
    marginHorizontal: '2.5%',
    backgroundColor: '#1c2230',
  },
  posterTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 1,
    fontFamily: 'Axiforma-Bold',
  },
  posterYear: {
    color: '#8c93a6',
    fontSize: 10,
  },
  emptyState: {
    color: '#a7aec1',
    marginBottom: 24,
  },
});