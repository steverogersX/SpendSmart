import { PricingData } from '../types';

export const pricingData: PricingData = {
    cursor: {
        name: 'Cursor',
        url: 'https://cursor.com/pricing',
        useCases: ['coding'],
        plans: {
            Pro:    { pricePerSeat: 20,  verifiedDate: '2026-05-07' },
            ProPlus:{ pricePerSeat: 60,  verifiedDate: '2026-05-07' },
            Ultra:  { pricePerSeat: 200, verifiedDate: '2026-05-07' },
            Teams:  { pricePerSeat: 40,  verifiedDate: '2026-05-07' },
        },
    },
    github_copilot: {
        name: 'GitHub Copilot',
        url: 'https://github.com/features/copilot/plans',
        useCases: ['coding'],
        plans: {
            Pro:        { pricePerSeat: 10,   verifiedDate: '2026-05-07' },
            ProPlus:    { pricePerSeat: 39,   verifiedDate: '2026-05-07' },
            Business:   { pricePerSeat: 19,   verifiedDate: '2026-05-07' },
            Enterprise: { pricePerSeat: null, verifiedDate: '2026-05-07' },
        },
    },
    claude: {
        name: 'Claude',
        url: 'https://claude.com/pricing',
        useCases: ['coding', 'writing', 'research', 'mixed'],
        plans: {
            Pro:        { pricePerSeat: 20,   verifiedDate: '2026-05-07' },
            Max5x:      { pricePerSeat: 100,  verifiedDate: '2026-05-07' },
            Max20x:     { pricePerSeat: 200,  verifiedDate: '2026-05-07' },
            Team:       { pricePerSeat: 30,   verifiedDate: '2026-05-07' },
            Enterprise: { pricePerSeat: null, verifiedDate: '2026-05-07' },
        },
    },
    chatgpt: {
        name: 'ChatGPT',
        url: 'https://openai.com/chatgpt/pricing/',
        useCases: ['coding', 'writing', 'data', 'research', 'mixed'],
        plans: {
            Go:         { pricePerSeat: 8,    verifiedDate: '2026-05-07' },
            Plus:       { pricePerSeat: 20,   verifiedDate: '2026-05-07' },
            Pro100:     { pricePerSeat: 100,  verifiedDate: '2026-05-07' },
            Pro200:     { pricePerSeat: 200,  verifiedDate: '2026-05-07' },
            Business:   { pricePerSeat: 25,   verifiedDate: '2026-05-07' },
            Enterprise: { pricePerSeat: null, verifiedDate: '2026-05-07' },
        },
    },
    gemini: {
        name: 'Gemini',
        url: 'https://gemini.google/subscriptions/',
        useCases: ['coding', 'writing', 'data', 'research', 'mixed'],
        plans: {
            Plus:  { pricePerSeat: 7.99,   verifiedDate: '2026-05-07' },
            Pro:   { pricePerSeat: 19.99,  verifiedDate: '2026-05-07' },
            Ultra: { pricePerSeat: 249.99, verifiedDate: '2026-05-07' },
        },
    },
    windsurf: {
        name: 'Windsurf',
        url: 'https://windsurf.com/pricing',
        useCases: ['coding'],
        plans: {
            Pro:        { pricePerSeat: 20,   verifiedDate: '2026-05-07' },
            Teams:      { pricePerSeat: 40,   verifiedDate: '2026-05-07' },
            Enterprise: { pricePerSeat: null, verifiedDate: '2026-05-07' },
        },
    },

    // Apis - usage-based, no fixed seat price
    anthropic_api: {
        name: 'Anthropic API',
        url: 'https://www.anthropic.com/pricing',
        useCases: ['coding', 'data'],
        plans: {
            // usage-based, no fixed seat price
            API: { pricePerSeat: null, verifiedDate: '2026-05-07' },
        },
    },
    openai_api: {
        name: 'OpenAI API',
        url: 'https://openai.com/api/pricing/',
        useCases: ['coding', 'data'],
        plans: {
            // usage-based, no fixed seat price
            API: { pricePerSeat: null, verifiedDate: '2026-05-07' },
        },
    },
    
};