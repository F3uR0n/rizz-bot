require("dotenv").config();

module.exports = {
    token: process.env.DISCORD_TOKEN,
    ownerId: process.env.OWNER_ID,

    randomImageChance: 0.05,
    backfireChance: 0.3,
    rizzPerMessage: 1,

    openai: {
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        maxTokens: 100,
        temperature: 0.9,
        // Minimum ms between AI roasts for the same user (prevents spam cost)
        perUserCooldownMs: 60 * 1000,
        // Max OpenAI calls per minute across all users
        maxPerMinute: 20,
        // How many past roasts to remember per user (for variety)
        recentRoastMemory: 5,
    },
};
