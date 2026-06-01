const { SlashCommandBuilder } = require("discord.js");
const { buildTrollPayload } = require("../handlers/trollEngine");
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
                content: `<@${caller.id}> tried to troll the owner. Nice try.`,
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
        const payload = await buildTrollPayload(actualTarget.id);

        const header = backfired
            ? `<@${caller.id}> trolled <@${target.id}> — backfired`
            : `<@${caller.id}> trolled <@${target.id}>`;

        const body = [header, payload.content].filter(Boolean).join("\n");

        await interaction.editReply({
            content: body,
            files: payload.files,
        });
    },
};
