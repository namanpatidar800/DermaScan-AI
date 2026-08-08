import AIProvider from './aiProvider.js';

class RealProvider extends AIProvider {
    async analyze(imageUrl, symptoms) {
        const apiKey = process.env.AI_API_KEY;
        // Using standard OpenAI Chat Completions API as the generic placeholder for Vision.
        const apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
        const model = process.env.AI_MODEL || 'gpt-4o';
        const timeoutMs = Number(process.env.AI_TIMEOUT_MS) || 30000;

        if (!apiKey) {
            throw new Error('Real AI provider is requested but AI_API_KEY is not configured in the environment.');
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const promptContext = `
                You are assisting a dermatology AI tool. Based on the attached image and the following user-provided symptoms:
                ${JSON.stringify(symptoms || {}, null, 2)}
                
                Provide a JSON response representing a preliminary, informational skin assessment.
                
                CRITICAL MEDICAL SAFETY INSTRUCTIONS:
                - You MUST NOT provide a medical diagnosis.
                - Use phrases like "Possible condition", "May be consistent with", etc in descriptions.
                - Do NOT recommend prescription drugs.
                - Do NOT claim diagnostic certainty.
                - If the image contains severe or dangerous indicators (e.g. asymmetry, irregular borders, severe infection), add strings to the "redFlags" array and set severity to "urgent".
                
                Output JSON strictly matching this schema:
                {
                    "possibleConditions": [
                        { "name": "String", "confidence": "Number between 0.0 and 1.0", "description": "String" }
                    ],
                    "observations": ["String"],
                    "severity": "low|moderate|high|urgent",
                    "recommendation": "String",
                    "redFlags": ["String"]
                }
            `;

            const payload = {
                model: model,
                response_format: { type: 'json_object' },
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: promptContext },
                            { type: 'image_url', image_url: { url: imageUrl } }
                        ]
                    }
                ]
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error('[RealProvider] API Error:', errData);
                throw new Error(errData.error?.message || 'The AI service returned an error.');
            }

            const data = await response.json();
            const contentString = data.choices?.[0]?.message?.content;

            if (!contentString) throw new Error('AI returned an empty response.');

            const parsed = JSON.parse(contentString);

            return this.validateResponse(parsed);

        } catch (err) {
            clearTimeout(timeout);
            if (err.name === 'AbortError') {
                throw new Error('The AI analysis request timed out. Please try again.');
            }
            throw new Error(`AI Analysis Failed: ${err.message}`);
        }
    }

    validateResponse(data) {
        // Enforce strict structure before allowing MongoDB insertion.
        let isValid = true;
        if (!Array.isArray(data.possibleConditions)) isValid = false;

        data.possibleConditions = (data.possibleConditions || []).map(c => {
            if (typeof c.name !== 'string') isValid = false;
            // Cap confidence between 0 and 1
            let conf = parseFloat(c.confidence);
            if (isNaN(conf)) conf = 0.5;
            conf = Math.min(Math.max(conf, 0), 1);
            return {
                name: c.name || 'Unknown',
                confidence: conf,
                description: c.description || ''
            };
        });

        if (!Array.isArray(data.observations)) data.observations = [];
        if (!Array.isArray(data.redFlags)) data.redFlags = [];

        const validSeverities = ['low', 'moderate', 'high', 'urgent'];
        if (!validSeverities.includes(data.severity)) {
            data.severity = 'moderate';
        }

        if (typeof data.recommendation !== 'string') data.recommendation = 'Consult a professional if symptoms persist.';

        if (!isValid) {
            throw new Error('AI returned a malformed response structure that failed validation.');
        }

        return {
            possibleConditions: data.possibleConditions,
            observations: data.observations,
            severity: data.severity,
            recommendation: data.recommendation,
            redFlags: data.redFlags,
            isDemo: false
        };
    }
}

export default RealProvider;
