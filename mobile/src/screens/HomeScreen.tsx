import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView, Linking, TextInput } from 'react-native';
import { useCompare } from '../context/CompareContext';
import { mobilePackageService } from '../services/mobilePackageService';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MockEngine } from '@vectormatrix/mock-engine';

const engine = new MockEngine(AsyncStorage as any);

export default function HomeScreen({ onGoToCompare, navigation }: { onGoToCompare: () => void, navigation?: any }) {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterDestination, setFilterDestination] = useState<string>('');
  const [filterMonth, setFilterMonth] = useState<string>('');
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(100000);
  const [showFilters, setShowFilters] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { selectedPackages, togglePackage } = useCompare();

  useEffect(() => {
    fetchPackages();
    loadEngineConfig();
    loadNotifications();
  }, [filterDestination, filterMonth, filterMaxPrice]);

  const loadEngineConfig = async () => {
    const config = await engine.getConfig();
    setIsOfflineMode(config.offlineMode);
  };

  const loadNotifications = async () => {
    try {
      const data = await AsyncStorage.getItem('vmx_mock_notifications');
      if (data) {
        const notifs = JSON.parse(data);
        const unread = notifs.filter((n: any) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch(e) {}
  };

  const toggleOfflineMode = async () => {
    const newMode = !isOfflineMode;
    setIsOfflineMode(newMode);
    await engine.updateConfig({ offlineMode: newMode });
  };

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await mobilePackageService.getPackages({
        query: filterDestination, // Or map to a separate text search if needed
        destination: filterDestination,
        maxPrice: filterMaxPrice
      });
      
      // Let's also do a quick month filter since our service didn't include it directly 
      // (or we could move month filter to the service)
      let filteredData = data;
      if (filterMonth) {
        filteredData = data.filter((d: any) => d.travel_month?.includes(filterMonth));
      }
      
      setPackages(filteredData);
    } catch (e) {
      console.warn("Failed to fetch packages", e);
    } finally {
      setLoading(false);
    }
  };

  const handleB2BLogin = () => {
    Linking.openURL('http://localhost:3001/b2b');
  };

  const renderItem = ({ item }: { item: any }) => {
    const isComparing = selectedPackages.some(p => p.id === item.id);
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('PackageDetail', { packageId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.destinationBadge}>{item.destination}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.agencyName}>🏢 {item.agency?.name} • ⭐ {item.hotel_stars} • 📅 {item.travel_month}</Text>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Starting from</Text>
              <Text style={styles.price}>Rs {item.priceValue?.toLocaleString()}</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.compareBtn, isComparing && styles.compareBtnActive]} 
              onPress={(e) => { e.stopPropagation(); togglePackage(item); }}
            >
              <Text style={[styles.compareText, isComparing && styles.compareTextActive]}>
                {isComparing ? 'Added ✓' : '+ Compare'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>VECTOMATRIX</Text>
          <Text style={styles.logoSubtext}>TRAVEL & TOURS</Text>
        </View>
        <View style={{flexDirection: 'row', gap: 16}}>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Text style={{fontSize: 24}}>🔔</Text>
            {unreadCount > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeTextCount}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <Text style={{fontSize: 24}}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('CustomerDashboard')}>
            <Text style={{fontSize: 24}}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search by Destination (e.g. Dubai)"
          value={filterDestination}
          onChangeText={setFilterDestination}
        />
        
        {showFilters && (
          <View style={styles.advancedFilters}>
            <TextInput 
              style={[styles.searchInput, {marginTop: 8}]} 
              placeholder="Travel Month (e.g. 2026-08)"
              value={filterMonth}
              onChangeText={setFilterMonth}
            />
            <View style={{marginTop: 8}}>
              <Text style={styles.priceLabel}>Max Price: Rs {filterMaxPrice.toLocaleString()}</Text>
              <View style={styles.priceButtons}>
                <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterMaxPrice(35000)}><Text style={styles.filterBtnText}>Under 35k</Text></TouchableOpacity>
                <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterMaxPrice(50000)}><Text style={styles.filterBtnText}>Under 50k</Text></TouchableOpacity>
                <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterMaxPrice(100000)}><Text style={styles.filterBtnText}>Any</Text></TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={[styles.offlineToggle, isOfflineMode && styles.offlineToggleActive]} onPress={toggleOfflineMode}>
              <Text style={[styles.offlineToggleText, isOfflineMode && styles.offlineToggleTextActive]}>
                {isOfflineMode ? '🔴 Offline Mode (Simulating)' : '🟢 Online Mode Active'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={packages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchPackages}
        />
      )}

      {/* Floating Action Button for Compare */}
      {selectedPackages.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Compare')}>
          <Text style={styles.fabText}>Compare ({selectedPackages.length}/3)</Text>
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.b2bButton} onPress={handleB2BLogin}>
          <Text style={styles.b2bButtonText}>B2B Operator Access 🔓</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginTop: 40 },
  logoText: { fontSize: 20, fontWeight: '900', color: '#1d4ed8', letterSpacing: -0.5 },
  logoSubtext: { fontSize: 10, fontWeight: '700', color: '#6b7280', letterSpacing: 1.5 },
  filterContainer: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  searchInput: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 8, fontSize: 14, color: '#111827' },
  advancedFilters: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  priceButtons: { flexDirection: 'row', gap: 8, marginTop: 4 },
  filterBtn: { backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  filterBtnText: { fontSize: 12, color: '#4b5563', fontWeight: 'bold' },
  listContainer: { padding: 16, paddingBottom: 80 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#f3f4f6', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  cardHeader: { height: 120, backgroundColor: '#e5e7eb', padding: 12 },
  destinationBadge: { backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, fontSize: 12, fontWeight: '700', color: '#1f2937' },
  cardBody: { padding: 16 },
  agencyName: { fontSize: 12, color: '#6b7280', marginBottom: 8, fontWeight: '500' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  priceLabel: { fontSize: 10, color: '#6b7280', marginBottom: 2 },
  price: { fontSize: 18, fontWeight: '900', color: '#2563eb' },
  compareBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f3f4f6' },
  compareBtnActive: { backgroundColor: '#dbeafe' },
  compareText: { fontSize: 12, fontWeight: 'bold', color: '#4b5563' },
  compareTextActive: { color: '#1d4ed8' },
  fab: { position: 'absolute', bottom: 90, alignSelf: 'center', backgroundColor: '#111827', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 8 },
  fabText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  b2bButton: { backgroundColor: '#f3f4f6', padding: 16, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  b2bButtonText: { color: '#374151', fontWeight: '600', fontSize: 14 },
  badgeCount: { position: 'absolute', top: -5, right: -5, backgroundColor: '#ef4444', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  badgeTextCount: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  offlineToggle: { marginTop: 15, padding: 12, borderRadius: 8, backgroundColor: '#dcfce3', alignItems: 'center', borderWidth: 1, borderColor: '#86efac' },
  offlineToggleActive: { backgroundColor: '#fee2e2', borderColor: '#fca5a5' },
  offlineToggleText: { color: '#166534', fontWeight: 'bold' },
  offlineToggleTextActive: { color: '#991b1b', fontWeight: 'bold' }
});
