import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ItemSelector from '../../components/ItemSelector';
import { addSale, getItems, Item } from '../../database/db';

export default function AddSaleScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [sellingPrice, setSellingPrice] = useState('');
  const [quantity, setQuantity] = useState('1');

  const loadItems = useCallback(async () => {
    setItems(await getItems());
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const onSave = async () => {
    const salePrice = Number(sellingPrice);
    const qty = Number(quantity);

    if (!selectedItem) {
      Alert.alert('Missing item', 'Please select an item.');
      return;
    }
    if (Number.isNaN(salePrice) || salePrice <= 0 || Number.isNaN(qty) || qty <= 0) {
      Alert.alert('Invalid input', 'Please enter valid selling price and quantity.');
      return;
    }

    await addSale({
      item: selectedItem.name,
      sellingPrice: salePrice,
      costPrice: selectedItem.cost_price,
      quantity: Math.floor(qty),
    });

    setSelectedItem(null);
    setSellingPrice('');
    setQuantity('1');
    Alert.alert('Saved', 'Sale recorded successfully.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Sale</Text>

      <ItemSelector items={items} selectedItem={selectedItem} onSelect={setSelectedItem} />

      <Text style={styles.label}>Selling Price</Text>
      <TextInput
        style={styles.input}
        value={sellingPrice}
        onChangeText={setSellingPrice}
        keyboardType="decimal-pad"
        placeholder="Enter selling price"
      />

      <Text style={styles.label}>Cost Price (Auto-filled)</Text>
      <TextInput
        style={[styles.input, styles.readOnly]}
        value={selectedItem ? String(selectedItem.cost_price) : ''}
        editable={false}
        placeholder="Select item first"
      />

      <Text style={styles.label}>Quantity</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="number-pad"
      />

      <Pressable style={styles.button} onPress={onSave}>
        <Text style={styles.buttonText}>💾 Save Sale</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  label: { marginTop: 10, marginBottom: 6, fontWeight: '600' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  readOnly: { backgroundColor: '#f3f4f6', color: '#6b7280' },
  button: {
    marginTop: 18,
    backgroundColor: '#16a34a',
    borderRadius: 8,
    alignItems: 'center',
    padding: 13,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
});
