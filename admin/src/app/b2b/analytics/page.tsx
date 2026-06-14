"use client";

import { useState, useEffect } from "react";
import { analyticsService } from "@/services/analyticsService";

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getAgencyMetrics('CURRENT_USER_AGENCY_ID');
      setMetrics({
        totalRevenue: data.revenueGenerated || 0,
        totalLeads: data.totalLeads || 0,
        conversionRate: data.conversionRate || 0,
        recentActivity: data.recentActivity || [],
        topPackage: data.topPackage || "Mauritius Explorer"
      });
    } catch (error) {
      alert("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-500 mt-1">Track your performance, leads, and revenue generation.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">Rs {metrics.totalRevenue.toLocaleString()}</p>
              <span className="inline-flex items-center text-xs font-medium text-green-600 mt-2">↑ 12% vs last month</span>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Leads</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.totalLeads}</p>
              <span className="inline-flex items-center text-xs font-medium text-green-600 mt-2">↑ 8% vs last month</span>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-500 mb-1">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.conversionRate}%</p>
              <span className="inline-flex items-center text-xs font-medium text-green-600 mt-2">↑ 2.4% vs last month</span>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-sm text-white">
              <p className="text-sm font-medium text-blue-100 mb-1">Top Performing Package</p>
              <p className="text-lg font-bold line-clamp-2 mt-1">{metrics.topPackage}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Chart Placeholder */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Overview</h2>
              <div className="h-64 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center relative overflow-hidden">
                {/* Simulated Chart Bars */}
                <div className="absolute bottom-0 w-full flex items-end justify-around px-8 h-full pt-8 pb-4">
                  {[40, 70, 45, 90, 65, 100, 85].map((height, i) => (
                    <div key={i} className="w-12 bg-blue-100 rounded-t-md relative group">
                      <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-md transition-all duration-1000" style={{ height: `${height}%` }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-6">
                {metrics.recentActivity.map((activity: any) => (
                  <div key={activity.id} className="flex items-start">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-4 ${activity.action === 'Lead Converted' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {activity.action === 'Lead Converted' ? '✓' : 'ℹ'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">Value: Rs {activity.amount.toLocaleString()} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 text-sm text-blue-600 font-bold hover:underline">
                View All Activity →
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
