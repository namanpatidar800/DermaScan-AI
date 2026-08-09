import AIProvider from './aiProvider.js';

class GeminiProvider extends AIProvider {
    async analyze(imageUrl, symptoms) {
        const apiKey = process.env.AI_API_KEY;
        const model = process.env.AI_MODEL || 'gemini-1.5-flash';
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const timeoutMs = Number(process.env.AI_TIMEOUT_MS) || 45000;

        if (!apiKey) {
            throw new Error('Gemini AI provider is requested but AI_API_KEY is not configured.');
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        try {
            // 1. Fetch backend image from Cloudinary to Base64
            const imageRes = await fetch(imageUrl);
            if (!imageRes.ok) throw new Error('Could not download image for AI Analysis.');
            const arrayBuffer = await imageRes.arrayBuffer();
            const base64Image = Buffer.from(arrayBuffer).toString('base64');
            const mimeType = imageRes.headers.get('content-type') || 'image/jpeg';

            // 2. Build Gemini Vision Payload
            const promptContext = `
                You are ASSISTING a progressive AI-dermatology screening tool called SKINOVA. 
                Based on the attached image and the following user-provided symptoms and context:
                ${JSON.stringify(symptoms || {}, null, 2)}
                
                Provide a JSON response representing a preliminary, informational skin assessment.

                🧠 SKINOVA UNCERTAINTY & EXPLAINABILITY ENGINE:
                1. If the image is blurry, extremely dark, indeterminable, or clearly NOT human skin, you MUST set confidenceTier to "UNABLE_TO_ASSESS" and multiplePossibilities to an empty array.
                2. Explicitly explain your reasoning in "whyThis" (Why these conditions match).
                3. Explicitly explain uncertainty in "whyUncertain" (e.g. overlap with other conditions, poor lighting, non-specific symptoms).
                4. "observations" MUST explicitly list visual and morphological indicators you see.
                
                CRITICAL MEDICAL SAFETY:
                - Do NOT provide a definitive diagnosis. Use probabilistic language.
                - Do NOT recommend prescription medication.
                - Separate AI statistical confidence (confidenceTier) from clinical risk (attentionLevel).
                - Add major clinical red flags to the "redFlags" array (e.g. bleeding, rapid growth, ABCD melanoma signs).
                
                Output JSON STRICTLY matching this schema with NO MARKDOWN TAGS:
                {
                    "confidenceTier": "HIGH|MODERATE|LOW|UNABLE_TO_ASSESS",
                    "attentionLevel": "LOW|MODERATE|HIGH",
                    "multiplePossibilities": [
                        { "name": "String", "confidence": Number between 0.0 and 1.0, "description": "String" }
                    ],
                    "whyThis": "String explaining the match",
                    "whyUncertain": "String explaining limitations and uncertainties",
                    "observations": ["Explainable visual finding 1", "Visual finding 2"],
                    "recommendation": "String detailing next steps",
                    "redFlags": ["String"]
                }
            `;

            const payload = {
                contents: [{
                    parts: [
                        { text: promptContext },
                        { inline_data: { mime_type: mimeType, data: base64Image } }
                    ]
                }],
                generationConfig: {
                    temperature: 0.2, // Low temp for more deterministic evaluation
                    response_mime_type: "application/json",
                }
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error('[GeminiProvider] API Error:', errData);
                throw new Error(errData.error?.message || 'The Gemini AI service returned an error.');
            }

            const data = await response.json();
            let contentString = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!contentString) throw new Error('AI returned an empty response.');

            // Clean markdown JSON wrapping if Gemini ignores instruction
            contentString = contentString.replace(/```json/g, '').replace(/```/g, '').trim();
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
        // Enforce strict structure before allowing MongoDB / LocalStorage insertion.
        let isValid = true;
        if (!Array.isArray(data.multiplePossibilities)) isValid = false;

        data.multiplePossibilities = (data.multiplePossibilities || []).map(c => {
            if (typeof c.name !== 'string') isValid = false;
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

        const validTiers = ['HIGH', 'MODERATE', 'LOW', 'UNABLE_TO_ASSESS'];
        if (!validTiers.includes(data.confidenceTier)) data.confidenceTier = 'LOW';

        const validAttentions = ['LOW', 'MODERATE', 'HIGH'];
        if (!validAttentions.includes(data.attentionLevel)) data.attentionLevel = 'MODERATE';

        if (typeof data.recommendation !== 'string') data.recommendation = 'Consult a professional if symptoms persist.';
        if (typeof data.whyThis !== 'string') data.whyThis = 'Information mapped conceptually to this condition based on generic visual patterns.';
        if (typeof data.whyUncertain !== 'string') data.whyUncertain = 'SKINOVA is an AI screening tool and cannot perfectly isolate variables like lighting or camera angle.';

        if (!isValid) throw new Error('AI returned a malformed response structure that failed validation.');

        return {
            multiplePossibilities: data.multiplePossibilities,
            confidenceTier: data.confidenceTier,
            attentionLevel: data.attentionLevel,
            whyThis: data.whyThis,
            whyUncertain: data.whyUncertain,
            observations: data.observations,
            recommendation: data.recommendation,
            redFlags: data.redFlags,
            isDemo: false
        };
    }
}

export default GeminiProvider;
