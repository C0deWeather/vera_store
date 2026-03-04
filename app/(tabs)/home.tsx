import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const actions = [
  { label: '➕ Add Sale', route: '/(tabs)/add-sale' as const },
  { label: '📋 View Sales', route: '/(tabs)/sales' as const },
  { label: '📊 Daily Summary', route: '/(tabs)/summary' as const },
  { label: '🧾 Manage Items', route: '/(tabs)/items' as const },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Track daily sales quickly and offline.</Text>
      {actions.map((action) => (
        <Pressable key={action.label} style={styles.button} onPress={() => router.push(action.route)}>
          <Text style={styles.buttonText}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9fafb' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#6b7280', marginBottom: 20 },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 14,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
