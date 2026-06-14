export interface TenantConfig {
  id: string;
  name: string;
  subdomain: string;
  primaryColor: string;
  logoText: string;
  plugins: {
    stripeCheckout: boolean;
    promotionalBillboards: boolean;
    packageComparison: boolean;
    imageGalleryUpload: boolean;
  };
}

export const defaultTenants: TenantConfig[] = [
  {
    id: "tenant-truememories",
    name: "TRUEMEMORIES Travel & Tours",
    subdomain: "truememories",
    primaryColor: "#ea580c", // Brand Orange
    logoText: "TRUEMEMORIES",
    plugins: {
      stripeCheckout: true,
      promotionalBillboards: true,
      packageComparison: true,
      imageGalleryUpload: true,
    }
  },
  {
    id: "tenant-basic",
    name: "VectoMatrix Basic Tours",
    subdomain: "basic",
    primaryColor: "#3b82f6", // Blue
    logoText: "VECTOMATRIX",
    plugins: {
      stripeCheckout: false,
      promotionalBillboards: false,
      packageComparison: false,
      imageGalleryUpload: false,
    }
  }
];

export class SaaSConfigManager {
  private activeTenantId: string = "tenant-truememories";

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vmx_active_tenant");
      if (saved) {
        this.activeTenantId = saved;
      } else {
        // Fallback to query param check
        const urlParams = new URLSearchParams(window.location.search);
        const tenantParam = urlParams.get("tenant");
        if (tenantParam) {
          const found = defaultTenants.find(t => t.subdomain === tenantParam || t.id === tenantParam);
          if (found) {
            this.activeTenantId = found.id;
            localStorage.setItem("vmx_active_tenant", found.id);
          }
        }
      }
    }
  }

  getActiveTenant(): TenantConfig {
    return defaultTenants.find(t => t.id === this.activeTenantId) || defaultTenants[0];
  }

  setActiveTenant(id: string) {
    const found = defaultTenants.find(t => t.id === id);
    if (found) {
      this.activeTenantId = id;
      if (typeof window !== "undefined") {
        localStorage.setItem("vmx_active_tenant", id);
      }
    }
  }

  getTenants(): TenantConfig[] {
    return defaultTenants;
  }

  updateTenantPlugins(id: string, plugins: Partial<TenantConfig["plugins"]>) {
    const found = defaultTenants.find(t => t.id === id);
    if (found) {
      found.plugins = { ...found.plugins, ...plugins };
      // Save changes dynamically
      if (typeof window !== "undefined") {
        localStorage.setItem(`vmx_tenant_plugins_${id}`, JSON.stringify(found.plugins));
      }
    }
  }

  loadDynamicPlugins() {
    if (typeof window !== "undefined") {
      defaultTenants.forEach(t => {
        const saved = localStorage.getItem(`vmx_tenant_plugins_${t.id}`);
        if (saved) {
          try {
            t.plugins = JSON.parse(saved);
          } catch (e) {
            console.error("Failed to parse saved plugins for", t.id, e);
          }
        }
      });
    }
  }
}

export const saasConfigManager = new SaaSConfigManager();
// Load dynamic configs immediately if client-side
saasConfigManager.loadDynamicPlugins();
