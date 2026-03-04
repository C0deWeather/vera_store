import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DailySummary, getDailySummary, getTodayDateString } from '../../database/db';

const initial: DailySummary = {
  totalRevenue: 0,
  totalCost: 0,
  totalProfit: 0,
  numberOfSales: 0,
};

export default function SummaryScreen() {
  const [summary, setSummary] = useState<DailySummary>(initial);

  const loadSummary = useCallback(async () => {
    setSummary(await getDailySummary(getTodayDateString()));
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Summary</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Total Revenue</Text>
        <Text style={styles.value}>₦{summary.totalRevenue.toFixed(2)}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Total Cost</Text>
        <Text style={styles.value}>₦{summary.totalCost.toFixed(2)}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Profit</Text>
        <Text style={[styles.value, { color: summary.totalProfit >= 0 ? '#16a34a' : '#dc2626' }]}>
          ₦{summary.totalProfit.toFixed(2)}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Number of Sales</Text>
        <Text style={styles.value}>{summary.numberOfSales}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  label: { color: '#6b7280' },
  value: { marginTop: 4, fontSize: 24, fontWeight: '700' },
});
