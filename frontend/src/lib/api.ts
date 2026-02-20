import type { TariffListResponse, TariffFilter, Tariff, Operator, Region, Benefit } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

// Tariffs
export async function getTariffs(filters: TariffFilter = {}): Promise<TariffListResponse> {
  const qs = buildQueryString(filters as Record<string, unknown>);
  return fetchAPI<TariffListResponse>(`/tariffs${qs}`);
}

export async function getTariff(slug: string): Promise<Tariff> {
  return fetchAPI<Tariff>(`/tariffs/${slug}`);
}

export async function getBestTariffs(regionSlug?: string, limit = 5): Promise<Tariff[]> {
  const qs = buildQueryString({ region_slug: regionSlug, limit });
  return fetchAPI<Tariff[]>(`/tariffs/best${qs}`);
}

// Operators
export async function getOperators(): Promise<Operator[]> {
  return fetchAPI<Operator[]>("/operators");
}

export async function getOperator(slug: string): Promise<Operator> {
  return fetchAPI<Operator>(`/operators/${slug}`);
}

// Regions
export async function getRegions(): Promise<Region[]> {
  return fetchAPI<Region[]>("/regions");
}

export async function detectRegion(): Promise<Region> {
  return fetchAPI<Region>("/regions/detect");
}

// Benefits
export async function getBenefits(benefitType?: string, operatorSlug?: string): Promise<Benefit[]> {
  const qs = buildQueryString({ benefit_type: benefitType, operator_slug: operatorSlug });
  return fetchAPI<Benefit[]>(`/benefits${qs}`);
}
