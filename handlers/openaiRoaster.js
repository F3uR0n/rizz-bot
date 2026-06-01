const config = require("../config");

// Lazy-init: bot starts fine with no OPENAI_API_KEY, AI just stays disabled
let _client = null;
function getClient() {
    if (_client) return _client;
    if (!process.env.OPENAI_API_KEY) return null;
    const OpenAI = require("openai");
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return _client;
}

// Per-user state: { lastUsed: ms, recentRoasts: string[] }
const userCache = new Map();

// Global sliding window
const globalWindow = { count: 0, resetAt: Date.now() + 60_000 };

function isRateLimited(userId) {
    const now = Date.now();
    const cfg = config.openai;

    if (now > globalWindow.resetAt) {
        globalWindow.count = 0;
        globalWindow.resetAt = now + 60_000;
    }
    if (globalWindow.count >= cfg.maxPerMinute) return true;

    const entry = userCache.get(userId);
    if (entry && now - entry.lastUsed < cfg.perUserCooldownMs) return true;

    return false;
}

function recordUsage(userId, roast) {
    globalWindow.count++;
    const entry = userCache.get(userId) || { recentRoasts: [] };
    entry.lastUsed = Date.now();
    entry.recentRoasts = [roast, ...entry.recentRoasts].slice(
        0,
        config.openai.recentRoastMemory,
    );
    userCache.set(userId, entry);
}

function buildPrompt(profile) {
    const cfg = config.openai;
    const recent = userCache.get(profile.userId)?.recentRoasts || [];

    const weaknesses =
        profile.weaknesses?.length > 0
            ? profile.weaknesses.join(", ")
            : "none on file";

    const jokes =
        profile.insideJokes?.length > 0
            ? profile.insideJokes.join(", ")
            : "none";

    const parts = [
        `Roast this Discord user:`,
        `Name: ${profile.name || "Unknown"}`,
        `Roast style: ${profile.roastStyle || "general"}`,
        `Known weaknesses: ${weaknesses}`,
        `Inside jokes: ${jokes}`,
    ];

    if (profile.customInstructions) {
        parts.push(`Special instructions: ${profile.customInstructions}`);
    }

    if (recent.length > 0) {
        parts.push(
            `\nAvoid repeating these recent roasts:\n` +
                recent.map((r, i) => `${i + 1}. ${r}`).join("\n"),
        );
    }

    return parts.join("\n");
}

async function generateRoast(profile) {
    const client = getClient();
    if (!client) return null;
    if (isRateLimited(profile.userId)) return null;

    const cfg = config.openai;

    const system =
        `You are a ruthless but playful Discord roast bot. ` +
        `Generate exactly ONE short roast (max 2 sentences, under 180 characters). ` +
        `Be punchy, specific, and funny. No slurs, no extreme content. ` +
        `Respond with only the roast text — no quotes, no explanations.`;

    try {
        const response = await client.chat.completions.create({
            model: cfg.model,
            messages: [
                { role: "system", content: system },
                { role: "user", content: buildPrompt(profile) },
            ],
            max_tokens: cfg.maxTokens,
            temperature: cfg.temperature,
        });

        const roast = response.choices[0]?.message?.content?.trim();
        if (!roast) return null;

        recordUsage(profile.userId, roast);
        return roast;
    } catch (err) {
        console.error("[OpenAI] Roast generation failed:", err.message);
        return null;
    }
}

module.exports = { generateRoast };
