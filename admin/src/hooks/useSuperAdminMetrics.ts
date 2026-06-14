import { useState, useEffect } from "react";
import { analyticsService } from "@/services/analyticsService";
import { mockEngine } from "@vectormatrix/mock-engine";
import { alerts } from "@/utils/alerts";

export function useSuperAdminMetrics() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);

  const fetchSystemData = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getSuperAdminMetrics();
      const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_ENGINE === 'true' && (typeof window !== 'undefined' ? window.location.hostname === 'localhost' : true);
      if (USE_MOCK_DATA) {
        const allAgencies = await mockEngine.getAgencies();
        setMetrics({ ...data, recentAgencies: allAgencies });
      } else {
        setMetrics(data || { totalAgencies: 0, totalActivePackages: 0, systemGMV: 0, recentAgencies: [] });
      }
    } catch (error) {
      alerts.error("Failed", "Could not load Super Admin Metrics");
    } finally {
      setLoading(false);
    }
  };

  const updateAgencyStatus = async (id: string, newStatus: string) => {
    try {
      await mockEngine.updateAgencyStatus(id, newStatus);
      alerts.success("Updated", `Agency marked as ${newStatus}`);
      await fetchSystemData();
    } catch (e) {
      alerts.error("Error", "Failed to update status");
    }
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  return { metrics, loading, updateAgencyStatus };
}
