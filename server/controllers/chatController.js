export const generateChatResponse = async (req, res) => {
    const { message, conversationHistory } = req.body;
    const apiKey = process.env.AI_API_KEY;
    const model = process.env.AI_MODEL || 'gemini-1.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    if (!apiKey) {
        return res.status(500).json({ error: 'AI is not configured securely.' });
    }
    if (!message) {
        return res.status(400).json({ error: 'Message payload is missing.' });
    }

    try {
        const strictPrompt = `
You are the SKINOVA Health Assistant, an AI built to guide users through the SKINOVA app.
You are strictly limited to discussing skin health tracking, explaining how SKINOVA features work (like the Uncertainty Engine, Body Site tracking, and Visual Follow-up Modes), and generalized knowledge about common skin conditions.

CRITICAL SAFETY BOUNDS:
1. YOU CANNOT DIAGNOSE CONDITIONS.
2. If the user posts a symptom list and asks "what is this?", you MUST explicitly tell them to use the "Scan Skin" feature of the application and do NOT give a condition guess.
3. Keep answers extremely concise (max 3-4 short sentences).
4. Do NOT recommend specific medications. You may suggest standard non-prescription care (like moisturizing) or explicitly recommend seeing a board-certified dermatologist.

${conversationHistory ? `Previous Context: ${JSON.stringify(conversationHistory)}` : ''}

User Query: ${message}
`;

        const payload = {
            contents: [{ parts: [{ text: strictPrompt }] }],
            generationConfig: { temperature: 0.3 }
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Gemini Upstream Failure Body:', errorBody);
            throw new Error(`Gemini upstream failed during chat generation: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const contentString = data.candidates?.[0]?.content?.parts?.[0]?.text || "I was unable to process that request.";

        res.status(200).json({ response: contentString });
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: 'SKINOVA Assistant is temporarily unavailable.' });
    }
};
