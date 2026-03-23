const { incrementRizz, getRizzTitle } = require("../handlers/rizz");
const {
    buildTrollPayload,
    getRandomRizzComment,
} = require("../handlers/trollEngine");
const config = require("../config");

module.exports = {
    name: "messageCreate",
    async execute(message) {
        // Ignore bot messages
        if (message.author.bot) return;

        const userId = message.author.id;

        // ─── 1. INCREMENT RIZZ ──────────────────────────────────────────────
        const newRizz = incrementRizz(userId, config.rizzPerMessage);
        const title = getRizzTitle(newRizz);

        // Milestone announcements (every 50 rizz)
        if (newRizz % 50 === 0) {
            await message.channel.send(
                `📊 **Rizz Update!** <@${userId}> just hit **${newRizz} rizz points**!\n` +
                    `Current title: **${title}** 🎖️`,
            );
        }

        // ─── 2. RANDOM TROLL IMAGE TRIGGER ─────────────────────────────────
        // Never fire on the bot owner
        if (
            userId !== config.ownerId &&
            Math.random() < config.randomImageChance
        ) {
            const payload = await buildTrollPayload(userId);
            const rizzComment = getRandomRizzComment();

            await message.channel.send({
                content: `🎲 **Random troll activated!**\n${payload.content}${rizzComment}`,
                files: payload.files,
            });
        }
    },
};
