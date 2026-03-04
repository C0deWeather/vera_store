import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { addItem, deleteItem, getItems, Item } from '../database/db';

export default function ManageItemsScreen() {
  const [name, setName] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [items, setItems] = useState<Item[]>([]);

  const loadItems = useCallback(async () => {
    setItems(await getItems());
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const onAdd = async () => {
    const parsed = Number(costPrice);
    if (!name.trim() || Number.isNaN(parsed) || parsed <= 0) {
      Alert.alert('Invalid Input', 'Enter a valid item name and cost price.');
      return;
    }

    try {
      await addItem(name, parsed);
      setName('');
      setCostPrice('');
      await loadItems();
    } catch {
      Alert.alert('Error', 'Item may already exist.');
    }
  };

  const onDelete = (item: Item) => {
    Alert.alert('Delete Item', `Delete ${item.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteItem(item.id);
          await loadItems();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Items</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Item name" />
      <TextInput
        style={styles.input}
        value={costPrice}
        onChangeText={setCostPrice}
        placeholder="Cost price"
        keyboardType="decimal-pad"
      />
      <Pressable style={styles.button} onPress={onAdd}>
        <Text style={styles.buttonText}>Add Item</Text>
      </Pressable>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No items yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.cost}>Cost: ₦{item.cost_price.toFixed(2)}</Text>
            </View>
            <Pressable onPress={() => onDelete(item)}>
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
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  button: { backgroundColor: '#2563eb', borderRadius: 8, padding: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  list: { paddingTop: 14, gap: 8 },
  empty: { color: '#6b7280' },
  row: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontWeight: '600' },
  cost: { color: '#6b7280' },
  delete: { color: '#dc2626', fontWeight: '600' },
});
