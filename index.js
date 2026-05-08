require("dotenv").config();
const {
    Client,
    GatewayIntentBits,
    Collection,
    REST,
    Routes,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config");

// ─── CLIENT SETUP ────────────────────────────────────────────────────────────
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Required to read message content
    ],
});

client.commands = new Collection();

// ─── LOAD COMMANDS ───────────────────────────────────────────────────────────
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((f) => f.endsWith(".js"));

const commandsForRegistration = [];

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.data.name, command);
    commandsForRegistration.push(command.data.toJSON());
}

// ─── LOAD EVENTS ─────────────────────────────────────────────────────────────
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((f) => f.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// ─── SLASH COMMAND INTERACTION HANDLER ───────────────────────────────────────
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const msg = { content: "❌ Something went wrong!", ephemeral: true };
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply(msg);
        } else {
            await interaction.reply(msg);
        }
    }
});

// ─── REGISTER SLASH COMMANDS WITH DISCORD ────────────────────────────────────
async function registerCommands() {
    const rest = new REST({ version: "10" }).setToken(config.token);

    try {
        console.log("🔄 Registering slash commands...");

        // To register globally (takes up to 1hr to propagate):
        // await rest.put(Routes.applicationCommands(client.application?.id), { body: commandsForRegistration });

        // To register to a specific guild instantly (recommended during dev):
        // Replace GUILD_ID below with your server's ID
        // await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commandsForRegistration });

        // We register after the client is ready to get the client ID:
        console.log(
            "⚠️  Slash commands registration is called in ready event.",
        );
    } catch (err) {
        console.error(err);
    }
}

// ─── READY EVENT: REGISTER COMMANDS ──────────────────────────────────────────
client.once("ready", async () => {
    const rest = new REST({ version: "10" }).setToken(config.token);

    try {
        console.log("🔄 Registering slash commands globally...");
        await rest.put(Routes.applicationCommands(client.user.id), {
            body: commandsForRegistration,
        });
        console.log("✅ Slash commands registered!");
    } catch (err) {
        console.error("Failed to register commands:", err);
    }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
client.login(config.token);
