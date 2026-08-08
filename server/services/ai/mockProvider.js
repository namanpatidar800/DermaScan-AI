/**
 * Mock AI Provider — For development/demo mode only.
 * Returns sample dermatology assessment results.
 * Replace with realProvider.js when connecting to an actual model.
 *
 * IMPORTANT: This is DEMO/MOCK mode. Results are not real medical diagnoses.
 */

import AIProvider from './aiProvider.js';

const MOCK_CONDITIONS = [
    {
        name: 'Eczema (Atopic Dermatitis)',
        conditions: [
            {
                name: 'Eczema (Atopic Dermatitis)',
                confidence: 0.74,
                description:
                    'A chronic inflammatory skin condition characterized by dry, itchy, and inflamed skin. Often appears in patches on the hands, feet, ankles, neck, upper chest, eyelids, and inside bends of elbows and knees.',
            },
            {
                name: 'Contact Dermatitis',
                confidence: 0.18,
                description:
                    'Skin inflammation caused by contact with a substance that causes irritation or an allergic reaction. Symptoms include red rash, itching, and blisters.',
            },
            {
                name: 'Psoriasis',
                confidence: 0.08,
                description:
                    'An autoimmune skin condition that speeds up the life cycle of skin cells, causing cells to build up rapidly on the surface and form scales and red patches.',
            },
        ],
        observations: [
            'Irregular patch with dry texture noted',
            'Reddish discoloration present',
            'Surface appears scaly with possible excoriation marks',
            'No apparent secondary infection signs',
        ],
        severity: 'moderate',
        recommendation:
            'Consult a dermatologist for proper evaluation. Keep the area moisturized. Avoid known irritants and allergens. Do not scratch the affected area.',
        redFlags: [],
    },
    {
        name: 'Acne Vulgaris',
        conditions: [
            {
                name: 'Acne Vulgaris',
                confidence: 0.81,
                description:
                    'A common skin condition involving oil glands and hair follicles. Presents as blackheads, whiteheads, pimples, or deeper lumps (cysts or nodules).',
            },
            {
                name: 'Rosacea',
                confidence: 0.12,
                description:
                    'A chronic condition that causes redness and visible blood vessels in your face and may produce small, red, pus-filled bumps.',
            },
            {
                name: 'Folliculitis',
                confidence: 0.07,
                description:
                    'Inflammation of hair follicles caused by bacterial or fungal infection, resulting in small red bumps or white-headed pimples around hair follicles.',
            },
        ],
        observations: [
            'Multiple comedones observed in affected region',
            'Inflammatory papules and pustules visible',
            'Skin surface shows excess sebum',
            'No signs of severe cystic involvement',
        ],
        severity: 'low',
        recommendation:
            'Gentle cleansing twice daily with non-comedogenic products. Avoid picking or squeezing lesions. Consider consulting a dermatologist for persistent or severe acne.',
        redFlags: [],
    },
    {
        name: 'Tinea (Ringworm)',
        conditions: [
            {
                name: 'Tinea Corporis (Ringworm)',
                confidence: 0.69,
                description:
                    'A fungal infection of the skin that appears as a ring-shaped, scaly patch. It is contagious and responds well to antifungal treatment.',
            },
            {
                name: 'Nummular Eczema',
                confidence: 0.21,
                description:
                    'A type of eczema that occurs in coin-shaped spots on the skin, often triggered by dry skin or an allergic reaction.',
            },
            {
                name: 'Granuloma Annulare',
                confidence: 0.10,
                description:
                    'A chronic, benign skin condition appearing in ring-shaped patches. More common in children and young adults.',
            },
        ],
        observations: [
            'Circular or ring-shaped lesion pattern observed',
            'Raised border with central clearing noted',
            'Skin appears scaly along the border region',
        ],
        severity: 'low',
        recommendation:
            'Antifungal medication is typically effective. Consult a healthcare provider for diagnosis confirmation. Keep the area clean and dry. Avoid sharing personal items.',
        redFlags: [],
    },
    {
        name: 'Urgent Evaluation Required',
        conditions: [
            {
                name: 'Melanoma (Suspected)',
                confidence: 0.55,
                description:
                    'A type of skin cancer that develops from melanocytes. Early detection is critical for successful treatment. A qualified medical professional must evaluate any suspicious lesion.',
            },
            {
                name: 'Dysplastic Nevus',
                confidence: 0.30,
                description:
                    'An atypical mole that may look unusual and has a slightly higher risk of becoming melanoma. Professional evaluation is recommended.',
            },
            {
                name: 'Seborrheic Keratosis',
                confidence: 0.15,
                description:
                    'A common non-cancerous skin growth that may appear alarming but is generally harmless. Medical evaluation is still recommended to rule out malignancy.',
            },
        ],
        observations: [
            'Irregular border pattern detected',
            'Asymmetric lesion shape noted',
            'Color variation within the lesion observed',
            'Size appears significant',
            'IMPORTANT: AI assessment cannot determine malignancy — professional evaluation required',
        ],
        severity: 'urgent',
        recommendation:
            'Please consult a qualified dermatologist or healthcare professional PROMPTLY for in-person evaluation of this lesion. Do not delay professional medical assessment.',
        redFlags: [
            'Irregular borders or asymmetry detected',
            'Color variation in the lesion',
            'Lesion size warrants professional evaluation',
            'Urgent: consult a dermatologist or doctor promptly',
        ],
    },
];

class MockProvider extends AIProvider {
    async analyze(imageUrl, symptoms) {
        console.log('[MockProvider] 🔵 DEMO MODE — returning sample AI result (not a real medical analysis)');

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Select a mock result based on symptoms (for demo variation)
        let selectedMock;
        if (symptoms?.itching && symptoms?.scaling) {
            selectedMock = MOCK_CONDITIONS[0]; // Eczema
        } else if (symptoms?.location?.toLowerCase().includes('face') || symptoms?.discharge) {
            selectedMock = MOCK_CONDITIONS[1]; // Acne
        } else if (symptoms?.spreading) {
            selectedMock = MOCK_CONDITIONS[2]; // Tinea
        } else {
            // Cycle through conditions based on current minute for variety
            const index = new Date().getMinutes() % MOCK_CONDITIONS.length;
            selectedMock = MOCK_CONDITIONS[index];
        }

        return {
            status: 'success',
            possibleConditions: selectedMock.conditions,
            observations: selectedMock.observations,
            severity: selectedMock.severity,
            recommendation: selectedMock.recommendation,
            redFlags: selectedMock.redFlags,
            disclaimer:
                'IMPORTANT: This is an AI-assisted preliminary assessment only. It is NOT a medical diagnosis. Please consult a qualified healthcare professional for proper diagnosis and treatment.',
            isDemo: true,
        };
    }
}

export default MockProvider;
