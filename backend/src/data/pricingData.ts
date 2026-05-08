import { PricingDataSchema, PricingData } from '../types/schemas';
import rawData from './vendor-pricing.json';

const result = PricingDataSchema.safeParse(rawData);

if (!result.success) {
    throw new Error(`Invalid pricingData.json:\n${result.error.message}`);
}

export const pricingData: PricingData = result.data;
