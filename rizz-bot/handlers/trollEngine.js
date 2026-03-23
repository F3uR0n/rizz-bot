const fs = require("fs");
const path = require("path");
const { AttachmentBuilder } = require("discord.js");

const IMAGES_DIR = path.join(__dirname, "../images");

// Troll messages sent when someone is trolled
const TROLL_MESSAGES = [
    "💀 EXPOSED! Look at this mf right here:",
    "😭 Bro really thought they were something:",
    "🤣 The server has spoken. Witness:",
    "☠️ There's no coming back from this:",
    "🔥 We found the footage bestie:",
    "📸 Leaked. Can't delete this:",
    "🚨 BREAKING NEWS from the troll department:",
    "👀 The algorithm chose you today:",
];

// Backfire messages when the troll gets trolled instead
const BACKFIRE_MESSAGES = [
    "💀 PLOT TWIST! The troll backfired! Look at the TROLLER:",
    "😂 You tried to troll but the universe chose YOU:",
    "🤡 Troll attempt failed. YOU got exposed instead:",
    "☠️ The rizz gods have spoken — troller gets trolled:",
];

// Random rizz comments added to messages
const RIZZ_COMMENTS = [
    "Bro's rizz is on another level 📈",
    "The audacity. The rizz.",
    "Rizz increment detected 👀",
    "This message added +1 to the rizz counter fr",
    "Certified message. Rizz noted.",
];

// Get a random element from an array
function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Check if an image exists for the user (any extension)
function getUserImage(userId) {
    if (!fs.existsSync(IMAGES_DIR)) return null;
    const files = fs.readdirSync(IMAGES_DIR);
    const match = files.find((f) => f.startsWith(userId + "."));
    return match ? path.join(IMAGES_DIR, match) : null;
}

// Build a troll message payload for a target user
async function buildTrollPayload(targetId, isSelf = false) {
    const msg = isSelf ? random(BACKFIRE_MESSAGES) : random(TROLL_MESSAGES);
    const imagePath = getUserImage(targetId);

    const payload = {
        content: `${msg}\n<@${targetId}>`,
        files: [],
    };

    if (imagePath) {
        payload.files.push(new AttachmentBuilder(imagePath));
    } else {
        payload.content += "\n*(no image on file for this legend... yet)*";
    }

    return payload;
}

// A random rizz comment to sprinkle into messages
function getRandomRizzComment() {
    return Math.random() < 0.15 ? `\n> *${random(RIZZ_COMMENTS)}*` : "";
}

module.exports = { buildTrollPayload, getRandomRizzComment };
