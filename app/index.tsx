import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { initDB } from './database/db';

export default function LoadingScreen() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        await initDB();
        router.replace('/(tabs)');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
      }
    };
    run();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mom&apos;s Sales App</Text>
      <ActivityIndicator size="large" color="#2563eb" />
      <Text style={styles.message}>{error ?? 'Preparing offline database...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center' },
  message: { color: '#6b7280', textAlign: 'center' },
});
