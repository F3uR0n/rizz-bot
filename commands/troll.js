const { SlashCommandBuilder } = require("discord.js");
const { buildTrollPayload } = require("../handlers/trollEngine");
const { getRizz, getRizzTitle } = require("../handlers/rizz");
const config = require("../config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("troll")
        .setDescription("Troll someone in the server 🤡")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("Who do you want to troll?")
                .setRequired(true),
        ),

    async execute(interaction) {
        const caller = interaction.user;
        const target = interaction.options.getUser("target");

        // ─── PROTECTION: Nobody trolls the owner ───────────────────────────
        if (target.id === config.ownerId) {
            return interaction.reply({
                content: `🛡️ **NICE TRY.** <@${caller.id}> tried to troll the inventor of this bot.\nThe audacity. The disrespect. The CLOWNERY. 🤡`,
                ephemeral: false,
            });
        }

        // ─── BOT CAN'T BE TROLLED ──────────────────────────────────────────
        if (target.bot) {
            return interaction.reply({
                content: `🤖 You can't troll a bot, genius. Try a human.`,
                ephemeral: true,
            });
        }

        await interaction.deferReply(); // Give us time to build the payload

        // ─── BACKFIRE LOGIC ────────────────────────────────────────────────
        // Randomly, the troll attempt backfires on the caller
        const backfired =
            caller.id !== config.ownerId &&
            Math.random() < config.backfireChance;

        const actualTarget = backfired ? caller : target;
        const payload = await buildTrollPayload(actualTarget.id, backfired);

        // ─── RIZZ STATS FOR TARGET ─────────────────────────────────────────
        const rizz = getRizz(actualTarget.id);
        const title = getRizzTitle(rizz);

        const intro = backfired
            ? `🔄 <@${caller.id}> tried to troll <@${target.id}> but it BACKFIRED!\n`
            : `🎯 <@${caller.id}> deployed a troll on <@${target.id}>!\n`;

        const rizzLine = `\n📊 <@${actualTarget.id}>'s rizz: **${rizz}** | Title: **${title}**`;

        await interaction.editReply({
            content: intro + payload.content + rizzLine,
            files: payload.files,
        });
    },
};
