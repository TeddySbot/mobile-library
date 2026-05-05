import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BookList, createList, deleteList, getLists } from '@/utils/library-storage';

type DefaultMeta = {
  color: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
};

const DEFAULT_META: Record<string, DefaultMeta> = {
  'to-read': { color: '#1E66F5', icon: 'eye' },
  reading: { color: '#F97316', icon: 'book' },
  finished: { color: '#22C55E', icon: 'check' },
};

export default function LibraryScreen() {
  const router = useRouter();
  const [lists, setLists] = useState<BookList[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  useFocusEffect(
    useCallback(() => {
      getLists().then(setLists);
    }, [])
  );

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const updated = await createList(newName);
    setLists(updated);
    setNewName('');
    setModalVisible(false);
  };

  const handleDelete = (list: BookList) => {
    Alert.alert('Supprimer', `Supprimer "${list.title}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          const updated = await deleteList(list.id);
          setLists(updated);
        },
      },
    ]);
  };

  const goToList = (listId: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push({ pathname: '/library/[listId]' as any, params: { listId } });

  const defaultLists = lists.filter((l) => l.isDefault);
  const customLists = lists.filter((l) => !l.isDefault);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
            <FontAwesome name="chevron-left" size={16} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>My Library</Text>
          <Pressable onPress={() => setModalVisible(true)} style={styles.headerAdd} hitSlop={12}>
            <FontAwesome name="plus" size={16} color="#B56CFF" />
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>My lists</Text>

        <View style={styles.defaultRow}>
          {defaultLists.map((list) => {
            const meta = DEFAULT_META[list.id] ?? { color: '#7344C8', icon: 'list' };
            return (
              <Pressable
                key={list.id}
                style={[styles.defaultCard, { backgroundColor: meta.color }]}
                onPress={() => goToList(list.id)}>
                <FontAwesome name={meta.icon} size={22} color="rgba(255,255,255,0.3)" />
                <Text style={styles.defaultCardTitle}>{list.title}</Text>
                <Text style={styles.defaultCardCount}>{list.books.length}</Text>
              </Pressable>
            );
          })}
        </View>

        {customLists.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Custom lists</Text>
            {customLists.map((list) => (
              <Pressable
                key={list.id}
                style={styles.customRow}
                onPress={() => goToList(list.id)}
                onLongPress={() => handleDelete(list)}>
                <View style={styles.customIcon}>
                  <FontAwesome name="list-ul" size={13} color="#B56CFF" />
                </View>
                <Text style={styles.customTitle}>{list.title}</Text>
                <Text style={styles.customCount}>{list.books.length}</Text>
                <FontAwesome name="chevron-right" size={12} color="#3A3F55" />
              </Pressable>
            ))}
            <Text style={styles.hint}>Maintenir appuyé pour supprimer une liste</Text>
          </>
        )}

        <Pressable style={styles.createButton} onPress={() => setModalVisible(true)}>
          <FontAwesome name="plus" size={13} color="#B56CFF" />
          <Text style={styles.createButtonText}>Créer une liste personnalisée</Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nouvelle liste</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Nom de la liste..."
              placeholderTextColor="#676C80"
              style={styles.modalInput}
              selectionColor="#B56CFF"
              autoFocus
              onSubmitEditing={handleCreate}
              returnKeyType="done"
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  setNewName('');
                }}
                style={styles.modalCancel}>
                <Text style={styles.modalCancelText}>Annuler</Text>
              </Pressable>
              <Pressable onPress={handleCreate} style={styles.modalConfirm}>
                <Text style={styles.modalConfirmText}>Créer</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#090B12' },
  content: { paddingHorizontal: 20, paddingBottom: 48 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    paddingBottom: 28,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#171B25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Axiforma-Bold',
  },
  headerAdd: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#171B25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 14,
  },
  defaultRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  defaultCard: {
    flex: 1,
    height: 110,
    borderRadius: 20,
    padding: 14,
    justifyContent: 'space-between',
  },
  defaultCardTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Axiforma-Bold',
  },
  defaultCardCount: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Axiforma-Bold',
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131620',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1E2335',
    gap: 12,
  },
  customIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#1C2032',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  customCount: {
    color: '#6B7285',
    fontSize: 13,
    marginRight: 4,
  },
  hint: {
    color: '#3A3F55',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 28,
    marginTop: 4,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2F45',
    borderRadius: 14,
    padding: 16,
    gap: 10,
    marginTop: 8,
  },
  createButtonText: {
    color: '#B56CFF',
    fontSize: 14,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#131620',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A2F45',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Axiforma-Bold',
    marginBottom: 16,
  },
  modalInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7344C8',
    backgroundColor: '#090B12',
    paddingHorizontal: 14,
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#1C2032',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    color: '#9AA0B5',
    fontSize: 14,
    fontWeight: '600',
  },
  modalConfirm: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#7344C8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Axiforma-Bold',
  },
});
