import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            home: 'home-outline',
            'add-sale': 'add-circle-outline',
            sales: 'list-outline',
            summary: 'stats-chart-outline',
            items: 'receipt-outline',
          };
          return <Ionicons name={icons[route.name] ?? 'ellipse-outline'} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="add-sale" options={{ title: 'Add Sale' }} />
      <Tabs.Screen name="sales" options={{ title: 'View Sales' }} />
      <Tabs.Screen name="summary" options={{ title: 'Daily Summary' }} />
      <Tabs.Screen name="items" options={{ title: 'Manage Items' }} />
    </Tabs>
  );
}
