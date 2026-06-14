import { StorageManager, StorageAdapterInterface } from './StorageAdapter';
import { initialPackages, initialLeads, initialAgencies, defaultMockConfig, initialBillboards } from './MockData';
import { PricingEngine } from './PricingEngine';

export class MockEngine {
  private storage: StorageManager;
  private configKey = 'vmx_mock_config';
  private packagesKey = 'vmx_mock_packages';
  private leadsKey = 'vmx_mock_leads';
  private agenciesKey = 'vmx_mock_agencies';
  private billboardsKey = 'vmx_mock_billboards';

  constructor(customAdapter?: StorageAdapterInterface) {
    this.storage = new StorageManager(customAdapter);
  }

  private queueKey = 'vmx_offline_queue';

  // --- EXTERNAL MOCKS ---
  async getMockWeather(destination: string) {
    await this.simulateNetwork();
    // Deterministic mock weather based on destination
    const temp = destination === 'DUBAI' ? 38 : destination === 'MALDIVES' ? 29 : 25;
    const condition = destination === 'DUBAI' ? 'Sunny' : 'Partly Cloudy';
    return { temp, condition, humidity: 60 };
  }

  async sendMockSMS(phone: string, message: string) {
    await this.simulateNetwork();
    console.log(`[MOCK SMS] To: ${phone} | Msg: ${message}`);
    return { status: 'sent', timestamp: new Date().toISOString() };
  }

  async convertCurrency(amount: number, from: string, to: string) {
    await this.simulateNetwork();
    const rates: Record<string, number> = { 'MUR': 1, 'USD': 0.022, 'EUR': 0.020 };
    if (!rates[from] || !rates[to]) return amount;
    return (amount / rates[from]) * rates[to];
  }

  // --- OFFLINE QUEUE ---
  async getOfflineQueue() {
    return this.storage.get<any[]>(this.queueKey, []);
  }

  async enqueueAction(actionType: string, payload: any) {
    const queue = await this.getOfflineQueue();
    const action = { id: `queued-${Date.now()}`, type: actionType, payload, timestamp: new Date().toISOString() };
    await this.storage.set(this.queueKey, [...queue, action]);
    return action;
  }

  async flushOfflineQueue() {
    const queue = await this.getOfflineQueue();
    if (queue.length === 0) return 0;
    
    // Simulate processing queue
    for (const action of queue) {
      if (action.type === 'CREATE_LEAD') {
        const leads = await this.storage.get<any[]>(this.leadsKey, initialLeads);
        await this.storage.set(this.leadsKey, [action.payload, ...leads]);
      } else if (action.type === 'CREATE_PACKAGE') {
        const pkgs = await this.storage.get<any[]>(this.packagesKey, initialPackages);
        await this.storage.set(this.packagesKey, [action.payload, ...pkgs]);
      } else if (action.type === 'CREATE_AGENCY') {
        const agencies = await this.storage.get<any[]>(this.agenciesKey, initialAgencies);
        await this.storage.set(this.agenciesKey, [action.payload, ...agencies]);
      }
    }
    
    // Clear queue
    await this.storage.set(this.queueKey, []);
    return queue.length;
  }

  // --- CONFIGURATION ---
  async getConfig() {
    return this.storage.get(this.configKey, defaultMockConfig);
  }

  async updateConfig(newConfig: Partial<typeof defaultMockConfig>) {
    const current = await this.getConfig();
    const updated = { ...current, ...newConfig };
    await this.storage.set(this.configKey, updated);
    
    // If we just went from offline to online, flush the queue
    if (current.offlineMode && !updated.offlineMode) {
      await this.flushOfflineQueue();
    }
  }

  async resetData() {
    await this.storage.set(this.packagesKey, initialPackages);
    await this.storage.set(this.leadsKey, initialLeads);
    await this.storage.set(this.agenciesKey, initialAgencies);
    await this.storage.set(this.billboardsKey, initialBillboards);
    await this.storage.set(this.configKey, defaultMockConfig);
    await this.storage.set(this.queueKey, []);
  }

  // --- DEV TOOLS (EXPORT / IMPORT) ---
  async exportState() {
    await this.ensureInitialized();
    const state = {
      packages: await this.storage.get(this.packagesKey, []),
      leads: await this.storage.get(this.leadsKey, []),
      agencies: await this.storage.get(this.agenciesKey, []),
      billboards: await this.storage.get(this.billboardsKey, []),
      config: await this.getConfig(),
      queue: await this.getOfflineQueue()
    };
    return JSON.stringify(state, null, 2);
  }

  async importState(jsonString: string) {
    try {
      const state = JSON.parse(jsonString);
      if (state.packages) await this.storage.set(this.packagesKey, state.packages);
      if (state.leads) await this.storage.set(this.leadsKey, state.leads);
      if (state.agencies) await this.storage.set(this.agenciesKey, state.agencies);
      if (state.billboards) await this.storage.set(this.billboardsKey, state.billboards);
      if (state.config) await this.storage.set(this.configKey, state.config);
      if (state.queue) await this.storage.set(this.queueKey, state.queue);
      return true;
    } catch (e) {
      console.error("[MockEngine] Failed to import state:", e);
      throw new Error("Invalid JSON state format");
    }
  }

  // --- INTERNAL HELPER ---
  private async simulateNetwork(isReadOperation = true) {
    const config = await this.getConfig();
    
    if (config.offlineMode) {
      if (!isReadOperation) {
        throw new Error("OFFLINE_MUTATION");
      } else {
        // Just return immediately for reads in offline mode (cache hit)
        return;
      }
    }

    if (config.latencyMs > 0) {
      await new Promise(r => setTimeout(r, config.latencyMs));
    }

    if (config.errorRatePercent > 0) {
      const random = Math.random() * 100;
      if (random < config.errorRatePercent) {
        throw new Error("Simulated Mock Engine Error (500 Internal Server Error)");
      }
    }
  }

  // --- INITIALIZATION ---
  private async ensureInitialized() {
    const pkgs = await this.storage.get<any[] | null>(this.packagesKey, null);
    if (!pkgs || pkgs.length < initialPackages.length) {
      await this.resetData();
    }
    const billboards = await this.storage.get<any[] | null>(this.billboardsKey, null);
    if (!billboards || billboards.length === 0) {
      await this.storage.set(this.billboardsKey, initialBillboards);
    }
  }

  // --- PACKAGES API ---
  async getPackages() {
    await this.simulateNetwork(true);
    await this.ensureInitialized();
    return this.storage.get(this.packagesKey, initialPackages);
  }

  async getPackageById(id: string) {
    await this.simulateNetwork(true);
    await this.ensureInitialized();
    const pkgs = await this.storage.get<any[]>(this.packagesKey, initialPackages);
    return pkgs.find(p => p.id === id) || null;
  }

  // --- PRICING ENGINE (Travel Lounge 2026 Rules) ---
  async calculatePrice(packageId: string, options: { 
    adults: number; 
    teens: number; 
    children: number; 
    infants: number; 
    roomTypeId?: string; 
    mealPlan?: string; 
  }) {
    const pkg = await this.getPackageById(packageId);
    return PricingEngine.calculatePrice(pkg, options);
  }

  async createPackage(payload: any) {
    try {
      await this.simulateNetwork(false);
    } catch (e: any) {
      if (e.message === "OFFLINE_MUTATION") {
        const newPkg = { ...payload, id: `pkg-${Date.now()}`, created_at: new Date().toISOString(), _isPendingSync: true };
        await this.enqueueAction('CREATE_PACKAGE', newPkg); // Wait, we don't have CREATE_PACKAGE in flush, but let's just do it
        return newPkg;
      }
      throw e;
    }
    await this.ensureInitialized();
    const pkgs = await this.storage.get<any[]>(this.packagesKey, initialPackages);
    const newPkg = { ...payload, id: `pkg-${Date.now()}`, created_at: new Date().toISOString() };
    await this.storage.set(this.packagesKey, [newPkg, ...pkgs]);
    return newPkg;
  }

  async updatePackage(id: string, payload: any) {
    await this.simulateNetwork(false);
    await this.ensureInitialized();
    let pkgs = await this.storage.get<any[]>(this.packagesKey, initialPackages);
    let updated = null;
    pkgs = pkgs.map(p => {
      if (p.id === id) {
        updated = { ...p, ...payload };
        return updated;
      }
      return p;
    });
    await this.storage.set(this.packagesKey, pkgs);
    return updated;
  }

  async deletePackage(id: string) {
    await this.simulateNetwork(false);
    await this.ensureInitialized();
    let pkgs = await this.storage.get<any[]>(this.packagesKey, initialPackages);
    pkgs = pkgs.filter(p => p.id !== id);
    await this.storage.set(this.packagesKey, pkgs);
    return true;
  }

  // --- LEADS API ---
  async getLeads() {
    await this.simulateNetwork(true);
    await this.ensureInitialized();
    return this.storage.get(this.leadsKey, initialLeads);
  }

  async createLead(payload: any) {
    const newLead = { ...payload, id: `lead-${Date.now()}`, created_at: new Date().toISOString() };
    
    try {
      await this.simulateNetwork(false);
    } catch (e: any) {
      if (e.message === "OFFLINE_MUTATION") {
        newLead._isPendingSync = true;
        await this.enqueueAction('CREATE_LEAD', newLead);
        return newLead;
      }
      throw e;
    }

    await this.ensureInitialized();
    const leads = await this.storage.get<any[]>(this.leadsKey, initialLeads);
    await this.storage.set(this.leadsKey, [newLead, ...leads]);
    return newLead;
  }

  async updateLeadStatus(id: string, status: string) {
    await this.simulateNetwork(false);
    await this.ensureInitialized();
    let leads = await this.storage.get<any[]>(this.leadsKey, initialLeads);
    let updated = null;
    leads = leads.map(l => {
      if (l.id === id) {
        updated = { ...l, status };
        return updated;
      }
      return l;
    });
    await this.storage.set(this.leadsKey, leads);
    return updated;
  }

  // --- AGENCIES API ---
  async getAgencies() {
    await this.simulateNetwork(true);
    await this.ensureInitialized();
    return this.storage.get(this.agenciesKey, initialAgencies);
  }

  async createAgency(payload: any) {
    try {
      await this.simulateNetwork(false);
    } catch (e: any) {
      if (e.message === "OFFLINE_MUTATION") {
        const newAgency = { ...payload, id: `agency-${Date.now()}`, joined: new Date().toISOString().split('T')[0], status: 'PENDING', _isPendingSync: true };
        await this.enqueueAction('CREATE_AGENCY', newAgency);
        return newAgency;
      }
      throw e;
    }
    
    await this.ensureInitialized();
    const agencies = await this.storage.get<any[]>(this.agenciesKey, initialAgencies);
    const newAgency = { ...payload, id: `agency-${Date.now()}`, joined: new Date().toISOString().split('T')[0], status: 'PENDING' };
    await this.storage.set(this.agenciesKey, [newAgency, ...agencies]);
    return newAgency;
  }

  async updateAgencyStatus(id: string, status: string) {
    await this.simulateNetwork(false);
    await this.ensureInitialized();
    let agencies = await this.storage.get<any[]>(this.agenciesKey, initialAgencies);
    let updated = null;
    agencies = agencies.map(a => {
      if (a.id === id) {
        updated = { ...a, status };
        return updated;
      }
      return a;
    });
    await this.storage.set(this.agenciesKey, agencies);
    return updated;
  }

  // --- BILLBOARDS API ---
  async getBillboards() {
    await this.simulateNetwork(true);
    await this.ensureInitialized();
    return this.storage.get(this.billboardsKey, initialBillboards);
  }

  async createBillboard(payload: any) {
    await this.simulateNetwork(false);
    await this.ensureInitialized();
    const billboards = await this.storage.get<any[]>(this.billboardsKey, initialBillboards);
    const newBillboard = { ...payload, id: `billboard-${Date.now()}`, created_at: new Date().toISOString() };
    await this.storage.set(this.billboardsKey, [...billboards, newBillboard]);
    return newBillboard;
  }

  async updateBillboard(id: string, payload: any) {
    await this.simulateNetwork(false);
    await this.ensureInitialized();
    let billboards = await this.storage.get<any[]>(this.billboardsKey, initialBillboards);
    let updated = null;
    billboards = billboards.map(b => {
      if (b.id === id) {
        updated = { ...b, ...payload };
        return updated;
      }
      return b;
    });
    await this.storage.set(this.billboardsKey, billboards);
    return updated;
  }

  async deleteBillboard(id: string) {
    await this.simulateNetwork(false);
    await this.ensureInitialized();
    let billboards = await this.storage.get<any[]>(this.billboardsKey, initialBillboards);
    billboards = billboards.filter(b => b.id !== id);
    await this.storage.set(this.billboardsKey, billboards);
    return true;
  }
}

