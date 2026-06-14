import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Alert } from 'react-native';
import { useCompare } from '../context/CompareContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

export default function CompareScreen({ navigation }: any) {
  const { selectedPackages, removePackage } = useCompare();

  const [selectedInsurance, setSelectedInsurance] = useState<string>('Standard Cover');
  const [includeEsim, setIncludeEsim] = useState<boolean>(false);
  const [upgradePrivateCar, setUpgradePrivateCar] = useState<boolean>(false);

  // MOCK SYSTEM SETTINGS
  const mockGlobalSettings = {
    acceptPayments: false, // Turned off by default to match web behavior, redirecting to Lead form
  };

  const calculateTotal = (basePrice: number) => {
    let total = basePrice;
    if (selectedInsurance === 'Premium SWAN Cover') total += 1500;
    if (includeEsim) total += 600;
    if (upgradePrivateCar) total += 2500;
    return total;
  };

  const handleCheckout = (pkg: any, isPaymentEnabled: boolean) => {
    if (isPaymentEnabled) {
      Alert.alert("Checkout via Stripe", `Initiating Stripe UI for ${pkg.title} at Rs ${calculateTotal(pkg.base_price_mur)}`);
    } else {
      navigation.navigate('Lead', { pkg, total: calculateTotal(pkg.base_price_mur) });
    }
  };

  if (selectedPackages.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Compare Packages</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No packages selected for comparison.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comparison Matrix</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Global Add-ons Selector */}
        <View style={styles.addonsCard}>
          <Text style={styles.sectionTitle}>Global Add-ons</Text>
          
          <View style={styles.addonRow}>
            <Text style={styles.addonLabel}>Insurance Tier</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.toggleBtn, selectedInsurance === 'Standard Cover' && styles.toggleActive]}
                onPress={() => setSelectedInsurance('Standard Cover')}
              >
                <Text style={[styles.toggleText, selectedInsurance === 'Standard Cover' && styles.toggleTextActive]}>Std</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleBtn, selectedInsurance === 'Premium SWAN Cover' && styles.toggleActive]}
                onPress={() => setSelectedInsurance('Premium SWAN Cover')}
              >
                <Text style={[styles.toggleText, selectedInsurance === 'Premium SWAN Cover' && styles.toggleTextActive]}>Premium (+1500)</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.addonRow}>
            <Text style={styles.addonLabel}>Global eSIM (+600 MUR)</Text>
            <TouchableOpacity 
              style={[styles.switchBtn, includeEsim && styles.switchActive]}
              onPress={() => setIncludeEsim(!includeEsim)}
            >
              <Text style={styles.switchText}>{includeEsim ? 'Added' : 'Add'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addonRow}>
            <Text style={styles.addonLabel}>Private Sedan (+2500 MUR)</Text>
            <TouchableOpacity 
              style={[styles.switchBtn, upgradePrivateCar && styles.switchActive]}
              onPress={() => setUpgradePrivateCar(!upgradePrivateCar)}
            >
              <Text style={styles.switchText}>{upgradePrivateCar ? 'Added' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Matrix Grid */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.matrixContainer}>
          {selectedPackages.map((pkg) => (
            <View key={pkg.id} style={styles.matrixCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.agencyName}>🏢 {pkg.agency?.name || 'Unknown Agency'}</Text>
                <Text style={styles.pkgTitle} numberOfLines={2}>{pkg.title}</Text>
                <Text style={styles.destinationBadge}>{pkg.destination}</Text>
              </View>

              <View style={styles.specsList}>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Hotel</Text>
                  <Text style={styles.specValue}>{pkg.hotel_name || 'TBA'} ({pkg.hotel_stars}★)</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Month</Text>
                  <Text style={styles.specValue}>{pkg.travel_month || 'TBA'}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Base Price</Text>
                  <Text style={styles.specValue}>Rs {pkg.base_price_mur.toLocaleString()}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.totalLabel}>Estimated Total</Text>
                <Text style={styles.totalPrice}>Rs {calculateTotal(pkg.base_price_mur).toLocaleString()}</Text>
                
                {mockGlobalSettings.acceptPayments ? (
                  <TouchableOpacity style={[styles.checkoutBtn, {backgroundColor: '#10b981'}]} onPress={() => handleCheckout(pkg, true)}>
                    <Text style={styles.checkoutText}>💳 Checkout via Stripe</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.checkoutBtn} onPress={() => handleCheckout(pkg, false)}>
                    <Text style={styles.checkoutText}>💬 Request Booking</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.removeBtn} onPress={() => removePackage(pkg.id)}>
                  <Text style={styles.removeText}>Remove from Compare</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginTop: 40 },
  backButton: { marginRight: 16 },
  backText: { fontSize: 16, color: '#2563eb', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#6b7280', fontSize: 16 },
  scrollContainer: { paddingVertical: 16 },
  addonsCard: { backgroundColor: '#fff', marginHorizontal: 16, padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#f3f4f6' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#111827' },
  addonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  addonLabel: { fontSize: 14, color: '#374151', fontWeight: '500' },
  buttonGroup: { flexDirection: 'row', backgroundColor: '#f3f4f6', borderRadius: 8, overflow: 'hidden' },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  toggleActive: { backgroundColor: '#2563eb' },
  toggleText: { fontSize: 12, color: '#4b5563', fontWeight: '600' },
  toggleTextActive: { color: '#fff' },
  switchBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f3f4f6' },
  switchActive: { backgroundColor: '#10b981' },
  switchText: { fontSize: 12, fontWeight: 'bold', color: '#374151' },
  matrixContainer: { paddingHorizontal: 16, paddingBottom: 32 },
  matrixCard: { width: CARD_WIDTH, backgroundColor: '#fff', borderRadius: 16, marginRight: 16, borderWidth: 1, borderColor: '#e5e7eb', overflow: 'hidden' },
  cardHeader: { padding: 16, backgroundColor: '#f9fafb', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  agencyName: { fontSize: 12, color: '#6b7280', marginBottom: 4, fontWeight: '600' },
  pkgTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  destinationBadge: { backgroundColor: '#e5e7eb', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, fontSize: 10, fontWeight: 'bold', color: '#374151' },
  specsList: { padding: 16 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  specLabel: { fontSize: 14, color: '#6b7280' },
  specValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  cardFooter: { padding: 16, backgroundColor: '#f8fafc', borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  totalLabel: { fontSize: 12, color: '#6b7280', textAlign: 'center' },
  totalPrice: { fontSize: 24, fontWeight: '900', color: '#2563eb', textAlign: 'center', marginVertical: 8 },
  checkoutBtn: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  checkoutText: { color: '#fff', fontWeight: 'bold' },
  removeBtn: { padding: 12, alignItems: 'center' },
  removeText: { color: '#ef4444', fontWeight: '600', fontSize: 12 }
});
