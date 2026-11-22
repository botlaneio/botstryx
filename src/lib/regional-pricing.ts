/**
 * Regional price book for the shared botstryx website.
 * US values remain in pricing.ts; Indian amounts are independent, not FX conversions.
 * Hostname routing and UI integration are intentionally separate follow-up changes.
 */
export type Region = 'us' | 'in';
export type Currency = 'USD' | 'INR';

export const REGION_BY_HOSTNAME: Record<string, Region> = {
  'botlane.io': 'us',
  'www.botlane.io': 'us',
  'botlane.in': 'in',
  'www.botlane.in': 'in',
};

export function regionForHostname(hostname: string): Region {
  return REGION_BY_HOSTNAME[hostname.toLowerCase().replace(/\.$/, '')] ?? 'us';
}

export const INDIA_PRICES_INR = {
  'website-core': 39900,
  'website-ascend': 79900,
  'website-apex': 149900,
  'app-scoping': 24900,
  'app-prototype': 299900,
  'app-full': 699900,
  'care': 2999,
  'care-plus': 6999,
  'ai-assistant': 49900,
  'extra-work': 1499,
} as const;

export type IndiaPlanId = keyof typeof INDIA_PRICES_INR;

export function regionalAmount(planId: string, usAmount: number, region: Region): number {
  if (region === 'us') return usAmount;
  if (!Object.prototype.hasOwnProperty.call(INDIA_PRICES_INR, planId)) {
    throw new Error(`Missing INR price for plan: ${planId}`);
  }
  return INDIA_PRICES_INR[planId as IndiaPlanId];
}

export function formatRegionalMoney(amount: number, region: Region): string {
  return new Intl.NumberFormat(region === 'in' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: region === 'in' ? 'INR' : 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Promotional US Founding Ten pricing does not apply to the India catalog. */
export const INDIA_FOUNDING_DISCOUNT_ENABLED = false;
/** Display note; actual tax treatment depends on the applicable invoice and law. */
export const INDIA_TAX_NOTE = 'GST additional where applicable';
