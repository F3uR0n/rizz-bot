const { SlashCommandBuilder } = require("discord.js");
const { getRizz, getRizzTitle } = require("../handlers/rizz");
const fs = require("fs");
const path = require("path");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rizz")
        .setDescription("Check rizz stats 📊")
        .addSubcommand((sub) =>
            sub
                .setName("check")
                .setDescription("Check someone's rizz")
                .addUserOption((opt) =>
                    opt
                        .setName("user")
                        .setDescription("Who to check?")
                        .setRequired(false),
                ),
        )
        .addSubcommand((sub) =>
            sub
                .setName("leaderboard")
                .setDescription("Top rizzlers in the server"),
        ),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();

        if (sub === "check") {
            const target =
                interaction.options.getUser("user") || interaction.user;
            const score = getRizz(target.id);
            const title = getRizzTitle(score);

            return interaction.reply({
                content:
                    `📊 **Rizz Report for <@${target.id}>**\n` +
                    `> Score: **${score} rizz points**\n` +
                    `> Title: **${title}**`,
            });
        }

        if (sub === "leaderboard") {
            const dataPath = path.join(__dirname, "../data/rizz.json");
            if (!fs.existsSync(dataPath)) {
                return interaction.reply(
                    "No rizz data yet. Start chatting! 💬",
                );
            }

            const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
            const sorted = Object.entries(data)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10);

            if (sorted.length === 0) {
                return interaction.reply("No data yet!");
            }

            const medals = ["🥇", "🥈", "🥉"];
            const lines = sorted.map(([id, score], i) => {
                const medal = medals[i] || `**#${i + 1}**`;
                return `${medal} <@${id}> — **${score} rizz** | ${getRizzTitle(score)}`;
            });

            return interaction.reply({
                content: `🏆 **Rizz Leaderboard**\n\n${lines.join("\n")}`,
            });
        }
    },
};
