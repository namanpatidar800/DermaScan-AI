/**
 * AI Provider Interface
 * All providers must implement this interface.
 *
 * analyze(imageUrl: string, symptoms: object) => Promise<AIResult>
 *
 * AIResult shape:
 * {
 *   status: 'success' | 'error',
 *   possibleConditions: [{ name, confidence, description }],
 *   observations: [string],
 *   severity: 'low' | 'moderate' | 'high' | 'urgent',
 *   recommendation: string,
 *   redFlags: [string]
 * }
 */

class AIProvider {
    // eslint-disable-next-line no-unused-vars
    async analyze(imageUrl, symptoms) {
        throw new Error('analyze() must be implemented by the provider');
    }
}

export default AIProvider;
