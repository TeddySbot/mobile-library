import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🚀 Ça marche !</Text>
      <Text style={styles.subtext}>Mon projet est bien configuré.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

export default Home;