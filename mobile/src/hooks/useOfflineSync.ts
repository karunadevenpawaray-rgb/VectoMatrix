import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mobileLeadService } from '../services/mobileLeadService';
import { supabase } from '../utils/supabase';

export function useOfflineSync() {
  const [queueCount, setQueueCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // 1. Check Offline Queue
    const queueRaw = await AsyncStorage.getItem('vmx_offline_queue');
    const queue = queueRaw ? JSON.parse(queueRaw) : [];
    setQueueCount(queue.length);

    // 2. Load my leads
    try {
      const allLeads = await mobileLeadService.getLeads();
      setLeads(allLeads);
    } catch (e) {
      console.log("Offline - Cannot load leads", e);
    }
  };

  const handleSync = async () => {
    if (queueCount === 0) return;
    setSyncing(true);
    
    try {
      const queueRaw = await AsyncStorage.getItem('vmx_offline_queue');
      const queue = queueRaw ? JSON.parse(queueRaw) : [];
      
      for (const item of queue) {
        await supabase.from('leads').insert({
          package_id: item.packageId,
          assigned_agency_id: 'agency-alpha', 
          client_name: item.name,
          client_email: item.email,
          client_phone: item.phone,
          calculated_total_mur: item.totalAmount,
          status: "PENDING",
          payment_status: "PAID"
        });
      }
      
      await AsyncStorage.removeItem('vmx_offline_queue');
      alert("Sync Complete! All offline bookings have been uploaded.");
      loadData();
    } catch (e) {
      alert("Sync failed. Are you still offline?");
    } finally {
      setSyncing(false);
    }
  };

  return { queueCount, syncing, leads, loadData, handleSync };
}
