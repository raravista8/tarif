export interface Operator {
  id: number;
  slug: string;
  name: string;
  logo_url: string | null;
  website?: string;
  operator_type?: string;
  is_active?: boolean;
  description?: string | null;
  parser_status?: string;
  auto_publish?: boolean;
}

export interface Region {
  id: number;
  slug: string;
  name: string;
  federal_district?: string | null;
}

export interface TariffOption {
  id: number;
  name: string;
  value: string;
}

export interface Tariff {
  id: number;
  name: string;
  slug: string;
  price: number;
  internet_gb: number | null;
  internet_unlimited: boolean;
  minutes: number | null;
  minutes_unlimited: boolean;
  sms: number | null;
  sms_unlimited: boolean;
  unlimited_socials: boolean;
  unlimited_messengers: boolean;
  unlimited_music: boolean;
  unlimited_video: boolean;
  family_tariff: boolean;
  esim: boolean;
  tethering: boolean;
  connection_type: "all" | "new" | "mnp";
  description: string | null;
  features: string | null;
  source_url: string;
  status: "draft" | "pending" | "published" | "archived";
  is_promo: boolean;
  promo_end_date: string | null;
  operator: Operator;
  regions: Region[];
  options: TariffOption[];
  created_at: string;
  updated_at: string;
}

export interface TariffListResponse {
  items: Tariff[];
  total: number;
  page: number;
  per_page: number;
}

export interface TariffFilter {
  region_slug?: string;
  max_price?: number;
  min_internet_gb?: number;
  internet_unlimited?: boolean;
  min_minutes?: number;
  minutes_unlimited?: boolean;
  min_sms?: number;
  sms_unlimited?: boolean;
  unlimited_socials?: boolean;
  unlimited_messengers?: boolean;
  unlimited_music?: boolean;
  family_tariff?: boolean;
  esim?: boolean;
  tethering?: boolean;
  operator_slug?: string;
  sort_by?: string;
  sort_order?: string;
  page?: number;
  per_page?: number;
}

export interface Benefit {
  id: number;
  operator: Operator;
  benefit_type: "mnp" | "cashback" | "loyalty" | "promo";
  title: string;
  description: string | null;
  conditions: string | null;
  source_url: string | null;
  is_active: boolean;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ModerationItem {
  id: number;
  action: string;
  status: "pending" | "approved" | "rejected";
  tariff_id: number | null;
  benefit_id: number | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  diff_summary: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string;
}
