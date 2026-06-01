const fs = require("fs");
const path = require("path");
const { AttachmentBuilder } = require("discord.js");
const { getProfile } = require("./profiles");
const { generateRoast } = require("./openaiRoaster");

const IMAGES_DIR = path.join(__dirname, "../images");
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

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

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
    const profile = getProfile(userId);
    if (profile) {
        const pool = [
            ...(profile.weaknesses || []),
            ...(profile.insideJokes || []),
        ].filter(Boolean);
        if (pool.length > 0) return random(pool);
    }
    return random(GENERIC_ROASTS);
}

async function getAIRoastLine(userId) {
    const profile = getProfile(userId);
    if (profile) {
        const aiRoast = await generateRoast(profile);
        if (aiRoast) return aiRoast;
    }
    return getRoastLine(userId);
}

// Returns { content: string, files: [] }
// content is the roast text only — no mention, no intro.
// Callers are responsible for the header line.
async function buildTrollPayload(targetId) {
    const imagePath = getUserImage(targetId);
    const files = [];

    const availableModes = [0, 2];
    if (imagePath) availableModes.push(1);
    const mode = random(availableModes);

    let content = "";

    if (mode === 1) {
        files.push(new AttachmentBuilder(imagePath));
    } else if (mode === 2) {
        content = await getAIRoastLine(targetId);
        if (imagePath && Math.random() < 0.4) {
            files.push(new AttachmentBuilder(imagePath));
        }
    } else {
        content = random(GENERIC_ROASTS);
    }

    return { content, files };
}

module.exports = { buildTrollPayload };
