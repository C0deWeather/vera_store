import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Item } from '../database/db';

type Props = {
  items: Item[];
  selectedItem: Item | null;
  onSelect: (item: Item) => void;
};

export default function ItemSelector({ items, selectedItem, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <View>
      <Text style={styles.label}>Item</Text>
      <TextInput
        placeholder="Search item"
        value={query}
        onFocus={() => setOpen(true)}
        onChangeText={(text) => {
          setQuery(text);
          setOpen(true);
        }}
        style={styles.input}
      />
      {selectedItem ? <Text style={styles.selected}>Selected: {selectedItem.name}</Text> : null}
      {open && (
        <View style={styles.dropdown}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setQuery(item.name);
                  setOpen(false);
                  onSelect(item);
                }}
                style={styles.option}
              >
                <Text>{item.name}</Text>
                <Text style={styles.cost}>₦{item.cost_price.toFixed(2)}</Text>
              </Pressable>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No matching items</Text>}
            style={styles.list}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  selected: { marginTop: 6, color: '#374151' },
  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    maxHeight: 180,
    backgroundColor: '#fff',
  },
  list: { maxHeight: 180 },
  option: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cost: { color: '#6b7280' },
  empty: { padding: 12, color: '#6b7280' },
});
