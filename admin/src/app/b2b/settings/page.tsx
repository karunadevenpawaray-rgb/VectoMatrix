"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"addons" | "communications">("addons");

  // Addon Architecture State
  const [addons, setAddons] = useState({
    addon_payments: true,
    addon_sms: false,
    addon_captcha: true,
    addon_advanced_search: true,
    addon_analytics: true,
    addon_customer_portals: false,
    addon_rich_text: true,
  });

  // SMTP & Template State
  const [smtp, setSmtp] = useState({
    host: "smtp.example.com",
    port: "587",
    user: "agency@example.com",
    pass: "********",
    fromEmail: "agency@example.com",
    fromName: "Shammi Tours"
  });

  const [templates, setTemplates] = useState({
    leadReceived: "<h1>New Lead Received</h1>\n<p>You have received a new inquiry from {{client_name}}.</p>",
    leadConverted: "<h1>Booking Confirmed</h1>\n<p>Dear {{client_name}}, your booking for {{package_title}} is confirmed.</p>"
  });

  const toggleAddon = (key: keyof typeof addons) => {
    setAddons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_ENGINE === 'true';

  const handleSaveAddons = async () => {
    if (USE_MOCK_DATA) {
      alert("Addon configuration saved locally in Mock Mode.");
      return;
    }
    // Live update to agencies table
  };

  const handleSaveCommunications = async () => {
    if (USE_MOCK_DATA) {
      alert("SMTP Settings & Templates saved locally in Mock Mode.");
      return;
    }
    // Live update to agency_settings table
    /*
    const { error } = await supabase.from('agency_settings').upsert({
      agency_id: 'CURRENT_USER_AGENCY_ID',
      smtp_host: smtp.host,
      smtp_port: parseInt(smtp.port),
      smtp_user: smtp.user,
      smtp_pass: smtp.pass, // Ideally encrypted
      smtp_from_email: smtp.fromEmail,
      smtp_from_name: smtp.fromName,
      template_lead_received: templates.leadReceived,
      template_lead_converted: templates.leadConverted
    });
    */
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-500 mt-1">Manage global addons and external integrations.</p>
        </div>
        <button 
          onClick={activeTab === "addons" ? handleSaveAddons : handleSaveCommunications}
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
        >
          Save {activeTab === "addons" ? "Addons" : "Communications"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab("addons")}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "addons" 
              ? "border-blue-600 text-blue-600" 
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Addon Architecture
        </button>
        <button
          onClick={() => setActiveTab("communications")}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "communications" 
              ? "border-blue-600 text-blue-600" 
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Email & SMTP Communications
        </button>
      </div>

      {activeTab === "addons" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payments Addon */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">💳 Online Payments</h2>
                <p className="text-sm text-gray-500 mt-1">Enable Stripe/MCB Juice checkout flows in the consumer app.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={addons.addon_payments} onChange={() => toggleAddon('addon_payments')} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
          {/* SMS Addon */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">📱 SMS Lead Alerts</h2>
                <p className="text-sm text-gray-500 mt-1">Instant text messages for new lead inquiries.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={addons.addon_sms} onChange={() => toggleAddon('addon_sms')} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
          {/* Advanced Search Addon */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">🔍 Advanced Search</h2>
                <p className="text-sm text-gray-500 mt-1">Powerful sidebar filtering and pagination engine.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={addons.addon_advanced_search} onChange={() => toggleAddon('addon_advanced_search')} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === "communications" && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Custom SMTP Server</h2>
            <p className="text-sm text-gray-500 mb-6">Connect your own mail server to send white-labeled emails directly to your clients.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                <input type="text" value={smtp.host} onChange={(e) => setSmtp({...smtp, host: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                <input type="text" value={smtp.port} onChange={(e) => setSmtp({...smtp, port: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" value={smtp.user} onChange={(e) => setSmtp({...smtp, user: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={smtp.pass} onChange={(e) => setSmtp({...smtp, pass: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                <input type="email" value={smtp.fromEmail} onChange={(e) => setSmtp({...smtp, fromEmail: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
                <input type="text" value={smtp.fromName} onChange={(e) => setSmtp({...smtp, fromName: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Email Templates</h2>
            <p className="text-sm text-gray-500 mb-6">Write custom HTML templates. Available variables: <code>{`{{client_name}}`}</code>, <code>{`{{package_title}}`}</code>, <code>{`{{total_amount}}`}</code>.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Lead Received Template (HTML)</label>
                <textarea 
                  value={templates.leadReceived} 
                  onChange={(e) => setTemplates({...templates, leadReceived: e.target.value})}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-2 font-mono text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking Confirmed Template (HTML)</label>
                <textarea 
                  value={templates.leadConverted} 
                  onChange={(e) => setTemplates({...templates, leadConverted: e.target.value})}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-2 font-mono text-sm" 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
