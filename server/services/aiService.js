/**
 * AI Service Orchestration Layer
 * Selects the appropriate AI provider based on environment config.
 */

import MockProvider from './ai/mockProvider.js';
import RealProvider from './ai/realProvider.js';
import GeminiProvider from './ai/geminiProvider.js';

const getProvider = () => {
    const providerName = process.env.AI_PROVIDER || 'mock';
    if (providerName === 'mock') {
        return new MockProvider();
    } else if (providerName === 'gemini') {
        return new GeminiProvider();
    }
    return new RealProvider();
};

export const analyzeSkinImage = async (imageUrl, symptoms) => {
    const provider = getProvider();
    const result = await provider.analyze(imageUrl, symptoms);
    return result;
};
