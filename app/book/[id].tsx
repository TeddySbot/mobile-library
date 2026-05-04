import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type WorkDetails = {
  description?: string | { value: string };
  subjects?: string[];
};

export default function BookDetailScreen() {
  const router = useRouter();
  const { id, title, author, year, coverUrl } = useLocalSearchParams<{
    id: string;
    title: string;
    author: string;
    year: string;
    coverUrl: string;
  }>();

  const [details, setDetails] = useState<WorkDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const largeCoverUrl = coverUrl
    ? coverUrl.replace('-M.jpg', '-L.jpg').replace('-S.jpg', '-L.jpg')
    : null;

  useEffect(() => {
    if (!id || !id.startsWith('/works/')) return;
    const workId = id.replace('/works/', '');
    setLoadingDetails(true);
    fetch(`https://openlibrary.org/works/${workId}.json`)
      .then((r) => r.json())
      .then((data: WorkDetails) => setDetails(data))
      .catch(() => setDetails(null))
      .finally(() => setLoadingDetails(false));
  }, [id]);

  const description = details?.description
    ? typeof details.description === 'string'
      ? details.description
      : details.description.value
    : null;

  const subjects = details?.subjects?.slice(0, 4) ?? [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
            <FontAwesome name="chevron-left" size={16} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.coverWrapper}>
          {largeCoverUrl ? (
            <Image source={{ uri: largeCoverUrl }} style={styles.cover} resizeMode="cover" />
          ) : (
            <View style={styles.coverFallback}>
              <FontAwesome name="book" size={72} color="#B56CFF" />
            </View>
          )}
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.title} numberOfLines={3}>
            {title}
          </Text>
          <Text style={styles.author}>{author}</Text>
          <Text style={styles.year}>{year}</Text>
        </View>

        {subjects.length > 0 && (
          <View style={styles.tagsRow}>
            {subjects.map((subject) => (
              <View key={subject} style={styles.tag}>
                <Text style={styles.tagText} numberOfLines={1}>
                  {subject}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          {loadingDetails ? (
            <ActivityIndicator size="small" color="#B56CFF" style={styles.loader} />
          ) : description ? (
            <Text style={styles.description}>{description}</Text>
          ) : (
            <Text style={styles.descriptionEmpty}>No description available.</Text>
          )}
        </View>

        <Pressable style={styles.addButton}>
          <FontAwesome name="plus" size={14} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add to library</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#090B12',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#171B25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverWrapper: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 28,
  },
  cover: {
    width: 200,
    height: 280,
    borderRadius: 18,
  },
  coverFallback: {
    width: 200,
    height: 280,
    borderRadius: 18,
    backgroundColor: '#171B25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBlock: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Axiforma-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  author: {
    color: '#B56CFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  year: {
    color: '#6B7285',
    fontSize: 13,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 28,
  },
  tag: {
    backgroundColor: '#1C2032',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#2A2F45',
  },
  tagText: {
    color: '#A0A8BF',
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Axiforma-Bold',
    marginBottom: 10,
  },
  description: {
    color: '#9AA0B5',
    fontSize: 14,
    lineHeight: 22,
  },
  descriptionEmpty: {
    color: '#6B7285',
    fontSize: 14,
    fontStyle: 'italic',
  },
  loader: {
    marginTop: 8,
  },
  addButton: {
    marginHorizontal: 24,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#7344C8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Axiforma-Bold',
  },
});
