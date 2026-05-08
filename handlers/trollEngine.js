const fs = require("fs");
const path = require("path");
const { AttachmentBuilder } = require("discord.js");

const IMAGES_DIR = path.join(__dirname, "../images");
const PERSONAL_ROASTS = require("../data/personalRoasts");

const TROLL_INTROS = [
    "💀 EXPOSED! Look at this mf right here:",
    "😭 Bro really thought they were something:",
    "🤣 The server has spoken. Witness:",
    "☠️ There's no coming back from this:",
    "🔥 We found the footage bestie:",
    "📸 Leaked. Can't delete this:",
    "🚨 BREAKING NEWS from the troll department:",
    "👀 The algorithm chose you today:",
];

const GENERIC_ROASTS = [
    "Their search history would end careers.",
    "Even autocorrect gave up on them.",
    "They type with one finger. Confidently.",
    "Last picked in gym class. Still.",
    "Their WiFi password is their own name.",
    "They reply 'k' to paragraphs.",
    "Sends voice notes instead of typing.",
    "Still uses Internet Explorer unironically.",
    "Their bio says 'I'm not like others'.",
    "Laughs at their own jokes before finishing them.",
];

const BACKFIRE_INTROS = [
    "💀 PLOT TWIST! The troll backfired! Look at the TROLLER:",
    "😂 You tried to troll but the universe chose YOU:",
    "🤡 Troll attempt failed. YOU got exposed instead:",
    "☠️ The rizz gods have spoken — troller gets trolled:",
];

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Supports multiple images per person
// Single image:   USERID.jpg
// Multiple images: USERID_1.jpg, USERID_2.png, USERID_3.jpg
function getUserImage(userId) {
    if (!fs.existsSync(IMAGES_DIR)) return null;
    const files = fs.readdirSync(IMAGES_DIR);
    const matches = files.filter((f) => {
        const name = path.parse(f).name;
        return name === userId || name.startsWith(userId + "_");
    });
    if (matches.length === 0) return null;
    return path.join(IMAGES_DIR, random(matches));
}

function getRoastLine(userId) {
    const personal = PERSONAL_ROASTS[userId];
    if (personal && personal.length > 0) return random(personal);
    return random(GENERIC_ROASTS);
}

async function buildTrollPayload(targetId, isSelf = false) {
    const intro = isSelf ? random(BACKFIRE_INTROS) : random(TROLL_INTROS);
    const imagePath = getUserImage(targetId);
    const files = [];

    const availableModes = [0, 2];
    if (imagePath) availableModes.push(1);
    const mode = random(availableModes);

    let content = `${intro}\n<@${targetId}>`;

    if (mode === 1) {
        content += "\n*(the image speaks for itself)*";
        files.push(new AttachmentBuilder(imagePath));
    } else if (mode === 2) {
        const roast = getRoastLine(targetId);
        content += `\n> 🎤 *"${roast}"*`;
        if (imagePath && Math.random() < 0.4) {
            files.push(new AttachmentBuilder(imagePath));
        }
    } else {
        const roast = random(GENERIC_ROASTS);
        content += `\n> 💬 ${roast}`;
    }

    return { content, files };
}

module.exports = { buildTrollPayload };
