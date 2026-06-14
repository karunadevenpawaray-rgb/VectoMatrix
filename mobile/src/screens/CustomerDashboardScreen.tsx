import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useOfflineSync } from '../hooks/useOfflineSync';

export default function CustomerDashboardScreen({ navigation }: any) {
  const { queueCount, syncing, leads, loadData, handleSync } = useOfflineSync();

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={syncing} onRefresh={loadData} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, Traveler!</Text>
        <Text style={styles.subtitle}>Your Digital Travel Companion</Text>
      </View>

      <View style={styles.content}>
        {/* Offline Sync Status Banner */}
        {queueCount > 0 && (
          <View style={styles.syncCard}>
            <View style={styles.syncInfo}>
              <Text style={styles.syncTitle}>Pending Sync</Text>
              <Text style={styles.syncSubtitle}>{queueCount} booking(s) waiting for network.</Text>
            </View>
            <TouchableOpacity style={styles.syncButton} onPress={handleSync} disabled={syncing}>
              <Text style={styles.syncButtonText}>{syncing ? "Syncing..." : "Sync Now"}</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>My Trips</Text>
        
        {leads.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No trips booked yet.</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Text style={styles.browseLink}>Browse Packages</Text>
            </TouchableOpacity>
          </View>
        ) : (
          leads.map(lead => (
            <View key={lead.id} style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <Text style={styles.tripStatus}>{lead.status}</Text>
                <Text style={styles.tripDate}>{new Date(lead.created_at).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.tripTitle}>{lead.package_id}</Text>
              <Text style={styles.tripPrice}>Rs {lead.calculated_total_mur.toLocaleString()}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#1e3a8a', padding: 30, paddingTop: 60, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  subtitle: { fontSize: 16, color: '#93c5fd', marginTop: 5 },
  content: { padding: 20 },
  
  syncCard: { backgroundColor: '#fef3c7', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, borderWidth: 1, borderColor: '#fbbf24' },
  syncInfo: { flex: 1 },
  syncTitle: { fontSize: 16, fontWeight: 'bold', color: '#92400e' },
  syncSubtitle: { fontSize: 12, color: '#b45309', marginTop: 2 },
  syncButton: { backgroundColor: '#d97706', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  syncButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 15 },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, backgroundColor: 'white', borderRadius: 16 },
  emptyText: { color: '#64748b', marginBottom: 10 },
  browseLink: { color: '#2563eb', fontWeight: 'bold' },

  tripCard: { backgroundColor: 'white', padding: 20, borderRadius: 16, elevation: 2, marginBottom: 15 },
  tripHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  tripStatus: { backgroundColor: '#e0e7ff', color: '#4338ca', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 10, fontWeight: 'bold' },
  tripDate: { color: '#64748b', fontSize: 12 },
  tripTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 5 },
  tripPrice: { fontSize: 16, color: '#2563eb', fontWeight: 'bold' }
});
