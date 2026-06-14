import { useState, useEffect } from "react";
import { analyticsService } from "@/services/analyticsService";

import { alerts } from "@/utils/alerts";

export function useSuperAdminMetrics() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);

  const fetchSystemData = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getSuperAdminMetrics();
      setMetrics(data);
    } catch (error) {
      alerts.error("Failed", "Could not load Super Admin Metrics");
    } finally {
      setLoading(false);
    }
  };

  const updateAgencyStatus = async (id: string, newStatus: string) => {
    try {
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
