import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MockEngine } from '@vectormatrix/mock-engine';

const engine = new MockEngine(AsyncStorage as any);

export default function PackageDetailScreen({ route, navigation }: any) {
  const { packageId } = route.params || { packageId: 'pkg-1' };
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [weather, setWeather] = useState<any>(null);
  const [currency, setCurrency] = useState('MUR');
  const [convertedPrice, setConvertedPrice] = useState<number>(0);

  useEffect(() => {
    loadPackage();
  }, []);

  const loadPackage = async () => {
    try {
      const data = await engine.getPackageById(packageId);
      setPkg(data);
      if (data) {
        setConvertedPrice(data.base_price_mur);
        const w = await engine.getMockWeather(data.destination);
        setWeather(w);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleCurrency = async () => {
    const nextCur = currency === 'MUR' ? 'USD' : currency === 'USD' ? 'EUR' : 'MUR';
    setCurrency(nextCur);
    if (pkg) {
      const newPrice = await engine.convertCurrency(pkg.base_price_mur, 'MUR', nextCur);
      setConvertedPrice(newPrice);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (!pkg) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Package Not Found. You may be offline.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.destination}>{pkg.destination}</Text>
        {weather && (
          <View style={styles.weatherBadge}>
            <Text style={styles.weatherText}>{weather.temp}°C {weather.condition}</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{pkg.title}</Text>
        
        {pkg.hotel_name && (
          <Text style={styles.hotel}>🏨 {pkg.hotel_name} {'★'.repeat(pkg.hotel_stars)}</Text>
        )}
        {pkg.service_type === 'activity' && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Activity • {pkg.duration_hours} Hours</Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.priceContainer} onPress={toggleCurrency}>
          <Text style={styles.priceLabel}>{pkg.service_type === 'hotel' ? 'Starting From' : 'Price per person'} (Tap to convert)</Text>
          <Text style={styles.priceValue}>{currency} {convertedPrice.toLocaleString(undefined, {maximumFractionDigits: 0})}</Text>
        </TouchableOpacity>

        <Text style={styles.description}>{pkg.description}</Text>

        {pkg.service_type === 'hotel' && pkg.room_types && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Rooms</Text>
            {pkg.room_types.map((room: any) => (
              <View key={room.id} style={styles.roomCard}>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomDesc}>Max Occupancy: {room.max_occupancy} Pax</Text>
              </View>
            ))}
          </View>
        )}

        {pkg.service_type === 'activity' && pkg.pickup_locations && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup Locations</Text>
            <View style={styles.pillContainer}>
              {pkg.pickup_locations.map((loc: string, idx: number) => (
                <View key={idx} style={styles.pill}>
                  <Text style={styles.pillText}>📍 {loc}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {pkg.service_type === 'package' && pkg.itinerary_days && pkg.itinerary_days.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Itinerary</Text>
            {pkg.itinerary_days.map((day: any) => (
              <View key={day.day} style={styles.itineraryCard}>
                <View style={styles.dayBadge}><Text style={styles.dayBadgeText}>{day.day}</Text></View>
                <View style={styles.itineraryContent}>
                  <Text style={styles.itineraryTitle}>{day.title}</Text>
                  <Text style={styles.itineraryDesc}>{day.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {pkg.reviews && pkg.reviews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {pkg.reviews.map((rev: any, idx: number) => (
              <View key={idx} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewAuthor}>{rev.author}</Text>
                  <Text style={styles.reviewRating}>{'★'.repeat(rev.rating)}</Text>
                </View>
                <Text style={styles.reviewComment}>"{rev.comment}"</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => navigation.navigate('BookingFlow', { packageId: pkg.id, totalAmount: pkg.base_price_mur })}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.inquiryButton}
          onPress={() => navigation.navigate('Lead', { pkg: pkg, total: pkg.base_price_mur })}
        >
          <Text style={styles.inquiryButtonText}>Send Inquiry</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#64748b' },
  header: { height: 200, backgroundColor: '#1e3a8a', justifyContent: 'center', alignItems: 'center' },
  destination: { fontSize: 32, fontWeight: '900', color: 'white', letterSpacing: 2 },
  weatherBadge: { backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 10 },
  weatherText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  hotel: { fontSize: 14, color: '#64748b', marginBottom: 20 },
  priceContainer: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 20, elevation: 2 },
  priceLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 },
  priceValue: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  description: { fontSize: 16, color: '#475569', lineHeight: 24, marginBottom: 30 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 15 },
  itineraryCard: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 1 },
  dayBadge: { backgroundColor: '#2563eb', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  dayBadgeText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  itineraryContent: { flex: 1 },
  itineraryTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  itineraryDesc: { fontSize: 14, color: '#64748b' },
  reviewCard: { backgroundColor: '#fef9c3', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#fef08a' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  reviewAuthor: { fontWeight: 'bold', color: '#854d0e' },
  reviewRating: { color: '#eab308' },
  reviewComment: { fontStyle: 'italic', color: '#a16207', fontSize: 14 },
  bookButton: { backgroundColor: '#2563eb', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  bookButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  inquiryButton: { backgroundColor: 'transparent', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: '#2563eb' },
  inquiryButtonText: { color: '#2563eb', fontSize: 18, fontWeight: 'bold' },
  badge: { backgroundColor: '#dcfce3', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, alignSelf: 'flex-start', marginBottom: 15 },
  badgeText: { color: '#166534', fontWeight: 'bold', fontSize: 12 },
  roomCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  roomName: { fontWeight: 'bold', fontSize: 16, color: '#0f172a' },
  roomDesc: { fontSize: 14, color: '#64748b', marginTop: 4 },
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  pillText: { color: '#475569', fontWeight: '500' }
});
