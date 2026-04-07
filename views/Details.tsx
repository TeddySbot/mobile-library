import { View, Text, Button, StyleSheet } from 'react-native';

export default function Details({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Page Profil 👤</Text>
      <Button title="Retour" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 }
});