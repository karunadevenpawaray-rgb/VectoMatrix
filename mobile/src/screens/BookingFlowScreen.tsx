import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MockEngine } from '@vectormatrix/mock-engine';

const engine = new MockEngine(AsyncStorage as any);

export default function BookingFlowScreen({ route, navigation }: any) {
  const { packageId } = route.params || { packageId: 'pkg-1' };
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [adults, setAdults] = useState('2');
  const [teens, setTeens] = useState('0');
  const [children, setChildren] = useState('0');
  const [infants, setInfants] = useState('0');

  const [processing, setProcessing] = useState(false);
  const [isOfflineSync, setIsOfflineSync] = useState(false);

  const [pricing, setPricing] = useState({ baseTotal: 0, serviceFeeAmount: 0, markupPercent: 0, finalTotal: 0 });

  useEffect(() => {
    recalculate();
  }, [adults, teens, children, infants]);

  const recalculate = async () => {
    try {
      const a = parseInt(adults) || 0;
      const t = parseInt(teens) || 0;
      const c = parseInt(children) || 0;
      const i = parseInt(infants) || 0;
      const res = await engine.calculatePrice(packageId, { adults: a, teens: t, children: c, infants: i });
      setPricing(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const lead = await engine.createLead({
        package_id: packageId,
        assigned_agency_id: 'agency-alpha', // Hardcoded mock
        client_name: name,
        client_email: email,
        client_phone: phone,
        calculated_total_mur: pricing.finalTotal,
        status: "PENDING",
        payment_status: "PAID" // Simulating auto-paid in mock mode
      });
      
      // Send a mock SMS via external mock
      await engine.sendMockSMS(phone, `Your booking for ${packageId} is confirmed. Amt: Rs ${pricing.finalTotal}`);

      if (lead._isPendingSync) {
        setIsOfflineSync(true);
        Alert.alert(
          "You are Offline", 
          "Your booking has been saved locally and will sync automatically when you reconnect.",
          [{ text: "OK", onPress: () => navigation.navigate('CustomerDashboard') }]
        );
      } else {
        // Create an in-app Push Notification
        await createPushNotification("Booking Confirmed! 🎉", "Your payment was successful and your itinerary is ready.");
        Alert.alert("Success", "Booking confirmed and synced!", [
          { text: "View Dashboard", onPress: () => navigation.navigate('CustomerDashboard') }
        ]);
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setProcessing(false);
    }
  };

  const createPushNotification = async (title: string, message: string) => {
    try {
      const data = await AsyncStorage.getItem('vmx_mock_notifications');
      const notifs = data ? JSON.parse(data) : [];
      notifs.unshift({
        id: `notif-${Date.now()}`,
        title,
        message,
        date: new Date().toISOString(),
        read: false
      });
      await AsyncStorage.setItem('vmx_mock_notifications', JSON.stringify(notifs));
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Complete Booking</Text>
      <Text style={styles.subtitle}>Enter passenger details. Works offline!</Text>

      {isOfflineSync && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>⚠️ Offline Mode Active. Data will be queued.</Text>
        </View>
      )}

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Passengers</Text>
        <View style={styles.paxGrid}>
          <View style={styles.paxBox}>
            <Text style={styles.label}>Adults</Text>
            <TextInput style={styles.inputSmall} value={adults} onChangeText={setAdults} keyboardType="number-pad" />
          </View>
          <View style={styles.paxBox}>
            <Text style={styles.label}>Teens</Text>
            <TextInput style={styles.inputSmall} value={teens} onChangeText={setTeens} keyboardType="number-pad" />
          </View>
          <View style={styles.paxBox}>
            <Text style={styles.label}>Child</Text>
            <TextInput style={styles.inputSmall} value={children} onChangeText={setChildren} keyboardType="number-pad" />
          </View>
          <View style={styles.paxBox}>
            <Text style={styles.label}>Infant</Text>
            <TextInput style={styles.inputSmall} value={infants} onChangeText={setInfants} keyboardType="number-pad" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Contact Details</Text>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="John Doe" />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="john@example.com" keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+230 5555 1234" keyboardType="phone-pad" />

        <View style={styles.summaryBox}>
          <View>
            <Text style={styles.summaryLabel}>Base Total: Rs {pricing.baseTotal.toLocaleString()}</Text>
            {pricing.markupPercent > 0 && (
              <Text style={styles.summaryLabel}>Service Fee ({pricing.markupPercent}%): Rs {pricing.serviceFeeAmount.toLocaleString()}</Text>
            )}
          </View>
          <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
            <Text style={styles.summaryLabel}>Total Pay</Text>
            <Text style={styles.summaryValue}>Rs {pricing.finalTotal.toLocaleString()}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handleCheckout} disabled={processing}>
          <Text style={styles.payButtonText}>{processing ? "Processing..." : "Pay Securely"}</Text>
        </TouchableOpacity>
        <View style={{height: 40}} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#0f172a', marginTop: 40 },
  subtitle: { fontSize: 16, color: '#64748b', marginBottom: 20 },
  offlineBanner: { backgroundColor: '#fef3c7', padding: 10, borderRadius: 8, marginBottom: 20 },
  offlineText: { color: '#b45309', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  form: { backgroundColor: 'white', padding: 20, borderRadius: 16, elevation: 2, marginBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 15, marginTop: 10 },
  paxGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  paxBox: { flex: 1, marginHorizontal: 2 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#334155', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 15 },
  inputSmall: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 10, fontSize: 16, textAlign: 'center' },
  summaryBox: { borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 20, marginBottom: 20 },
  summaryLabel: { fontSize: 14, color: '#64748b' },
  summaryValue: { fontSize: 24, fontWeight: '900', color: '#2563eb' },
  payButton: { backgroundColor: '#2563eb', padding: 16, borderRadius: 12, alignItems: 'center' },
  payButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
