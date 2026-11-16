// ==============================================================================
// FinSmart API Client - High-Performance Typed API & Formatting Utility
// ==============================================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/v1";

export function getTenantSlug(): string {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("finsmart_tenant") || process.env.NEXT_PUBLIC_TENANT || "public";
  }
  return process.env.NEXT_PUBLIC_TENANT || "public";
}

export function setTenantSlug(tenant: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("finsmart_tenant", tenant.trim().toLowerCase());
  }
}

export interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  token?: string | null;
  tenant?: string;
}

export async function api<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const tenant = options.tenant || getTenantSlug();
  const token = options.token || (typeof window !== "undefined" ? sessionStorage.getItem("finsmart_token") : null);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Tenant-ID": tenant,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || (options.body ? "POST" : "GET"),
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let errorDetail = "An unexpected error occurred.";
    try {
      const errJson = await res.json();
      if (typeof errJson.detail === "string") {
        errorDetail = errJson.detail;
      } else if (Array.isArray(errJson.detail)) {
        errorDetail = errJson.detail.map((d: any) => d.msg || JSON.stringify(d)).join(", ");
      }
    } catch {
      errorDetail = `Request failed with status ${res.status}`;
    }
    throw new Error(errorDetail);
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  return res.json();
}

// -----------------------------------------------------------------------------
// Money Utility: Strict Integer Paise Minor Units (1 Rupee = 100 Paise)
// -----------------------------------------------------------------------------

export function toPaise(rupees: string | number): number {
  const num = typeof rupees === "number" ? rupees : parseFloat(rupees || "0");
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}

export function toRupees(paise: number): number {
  return (paise || 0) / 100;
}

export function formatINR(paise: number): string {
  const rupees = toRupees(paise);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(rupees);
}

export const inr = formatINR;
