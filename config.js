require("dotenv").config();

module.exports = {
    token: process.env.DISCORD_TOKEN,
    ownerId: process.env.OWNER_ID, // YOU — can never be trolled

    // Chance (0.0 to 1.0) that a random troll image fires on a message
    randomImageChance: 0.05, // 5% chance per message

    // Chance (0.0 to 1.0) that when X trolls Y, X's own image backfires
    backfireChance: 0.3, // 30% chance the troll backfires on the requester

    rizzPerMessage: 1, // Base rizz gained per message
};
