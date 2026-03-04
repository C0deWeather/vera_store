import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { deleteSale, getSalesByDate, getTodayDateString, Sale } from '../../database/db';

export default function SalesScreen() {
  const [sales, setSales] = useState<Sale[]>([]);

  const loadSales = useCallback(async () => {
    setSales(await getSalesByDate(getTodayDateString()));
  }, []);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const onDelete = (id: number) => {
    Alert.alert('Delete Sale', 'Delete this sale?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteSale(id);
          await loadSales();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's Sales</Text>
      <FlatList
        data={sales}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>No sales recorded today.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.item}>{item.item}</Text>
              <Text>Total: ₦{item.total_sale.toFixed(2)}</Text>
              <Text style={styles.time}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
            </View>
            <Pressable onPress={() => onDelete(item.id)}>
              <Text style={styles.delete}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  empty: { color: '#6b7280' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: { fontWeight: '700' },
  time: { color: '#6b7280', marginTop: 4 },
  delete: { color: '#dc2626', fontWeight: '600' },
});
