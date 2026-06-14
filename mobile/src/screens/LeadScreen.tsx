import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { mobileLeadService } from '../services/mobileLeadService';

export default function LeadScreen({ route, navigation }: any) {
  const { pkg, total } = route.params || {};

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !phone) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      await mobileLeadService.submitLead({
        packageId: pkg.id,
        agencyId: pkg.agency_id,
        name,
        email,
        phone,
        total
      });
      
      Alert.alert('Lead Sent', 'Your inquiry has been successfully sent to the agency!', [
        { text: 'OK', onPress: () => {
          setName('');
          setEmail('');
          setPhone('');
          navigation.navigate('Home');
        } }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Booking</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Package Summary</Text>
          <Text style={styles.pkgTitle}>{pkg?.title || 'Unknown Package'}</Text>
          <Text style={styles.pkgAgency}>Operated by {pkg?.agency?.name || 'Unknown Agency'}</Text>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Estimated Total:</Text>
            <Text style={styles.totalValue}>Rs {total?.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Contact Details</Text>
          
          <Text style={styles.label}>Full Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="John Doe" 
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput 
            style={styles.input} 
            placeholder="john@example.com" 
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>WhatsApp / Phone</Text>
          <TextInput 
            style={styles.input} 
            placeholder="+230 5555 1234" 
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TouchableOpacity 
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Submit Inquiry</Text>
            )}
          </TouchableOpacity>
        </View>
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
  container: { padding: 16 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#e5e7eb' },
  summaryTitle: { fontSize: 12, fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 },
  pkgTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  pkgAgency: { fontSize: 12, color: '#6b7280', marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  totalLabel: { fontSize: 14, color: '#374151', fontWeight: '500' },
  totalValue: { fontSize: 18, color: '#2563eb', fontWeight: 'bold' },
  formCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#4b5563', marginBottom: 8 },
  input: { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 16, color: '#111827' },
  submitBtn: { backgroundColor: '#111827', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 8 },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
