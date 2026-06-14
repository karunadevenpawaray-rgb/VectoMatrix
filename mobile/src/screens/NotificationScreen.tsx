import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await AsyncStorage.getItem('vmx_mock_notifications');
      if (data) {
        setNotifications(JSON.parse(data));
      } else {
        // Seed with a welcome notification
        const initial = [{
          id: 'notif-1',
          title: 'Welcome to VectoMatrix',
          message: 'Your ultimate travel booking companion.',
          date: new Date().toISOString(),
          read: false
        }];
        await AsyncStorage.setItem('vmx_mock_notifications', JSON.stringify(initial));
        setNotifications(initial);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const markAsRead = async (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    await AsyncStorage.setItem('vmx_mock_notifications', JSON.stringify(updated));
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.notifCard, !item.read && styles.unreadCard]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notifHeader}>
        <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.message}>{item.message}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList 
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No notifications yet.</Text>}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { fontSize: 24, fontWeight: 'bold', padding: 20, paddingBottom: 10, color: '#0f172a' },
  notifCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  unreadCard: { borderColor: '#bfdbfe', backgroundColor: '#eff6ff' },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  title: { fontWeight: '600', fontSize: 16, color: '#334155' },
  unreadTitle: { color: '#1d4ed8', fontWeight: 'bold' },
  date: { fontSize: 12, color: '#94a3b8' },
  message: { color: '#475569', fontSize: 14, lineHeight: 20 },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40 }
});
