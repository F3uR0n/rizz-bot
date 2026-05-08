const { incrementRizz, getNextLevel } = require("../handlers/rizz");
const { buildTrollPayload } = require("../handlers/trollEngine");
const config = require("../config");

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.author.bot) return;

        const userId = message.author.id;

        // ── 1. INCREMENT RIZZ + LEVEL UP CHECK ────────────────────────────────────
        const { newScore, newLevel, leveledUp } = incrementRizz(
            userId,
            config.rizzPerMessage,
        );

        if (leveledUp) {
            const next = getNextLevel(newScore);
            const nextInfo = next
                ? `\n> Next level: **${next.title}** at **${next.required} msgs**`
                : `\n> 👑 MAX LEVEL REACHED`;

            await message.channel.send(
                `🎉 **LEVEL UP!** <@${userId}> is now **${newLevel.title}**!\n` +
                    `> Messages: **${newScore}**` +
                    nextInfo,
            );
        }

        // ── 2. RANDOM TROLL IMAGE TRIGGER ─────────────────────────────────────────
        if (
            userId !== config.ownerId &&
            Math.random() < config.randomImageChance
        ) {
            const payload = await buildTrollPayload(userId);
            await message.channel.send({
                content: `🎲 **Random troll activated on** <@${userId}>!\n${payload.content}`,
                files: payload.files,
            });
        }
    },
};
