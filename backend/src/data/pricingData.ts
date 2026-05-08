import { PricingDataSchema, PricingData, SubscriptionPricingData, APIPricingData } from '../types/pricing';
import rawData from './vendor-pricing.json';

const result = PricingDataSchema.safeParse(rawData);

if (!result.success) {
    throw new Error(`Invalid vendor-pricing.json:\n${result.error.message}`);
}

const allData: PricingData = result.data;

export const pricingData: SubscriptionPricingData = Object.fromEntries(
    Object.entries(allData).filter(([, v]) => v.type === 'subscription'),
) as SubscriptionPricingData;

export const apiPricingData: APIPricingData = Object.fromEntries(
    Object.entries(allData).filter(([, v]) => v.type === 'api'),
) as APIPricingData;
