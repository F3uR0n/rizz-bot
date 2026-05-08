const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/rizz.json");

function loadRizz() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
        fs.writeFileSync(DATA_FILE, JSON.stringify({}));
    }
    const raw = fs.readFileSync(DATA_FILE, "utf8").trim();
    return raw ? JSON.parse(raw) : {};
}

function saveRizz(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ── LEVEL SYSTEM ──────────────────────────────────────────────────────────────
// Each level requires this many TOTAL messages to reach
const LEVELS = [
    { level: 0, required: 0, title: "🫠 Rizz Rookie" },
    { level: 1, required: 1, title: "🙂 Rizz Apprentice" }, // 1 msg
    { level: 2, required: 3, title: "😎 Mid-Level Rizzer" }, // 2 more msgs
    { level: 3, required: 8, title: "😏 Certified Rizzy" }, // 5 more msgs
    { level: 4, required: 18, title: "💅 Elite Rizz Lord" }, // 10 more msgs
    { level: 5, required: 38, title: "🔥 LEGENDARY RIZZLER" }, // 20 more msgs
];

function getLevel(score) {
    let current = LEVELS[0];
    for (const l of LEVELS) {
        if (score >= l.required) current = l;
    }
    return current;
}

function getNextLevel(score) {
    for (const l of LEVELS) {
        if (score < l.required) return l;
    }
    return null; // already max level
}

// Increment score, return { newScore, oldLevel, newLevel, leveledUp }
function incrementRizz(userId, amount = 1) {
    const data = loadRizz();
    const oldScore = data[userId] || 0;
    const oldLevel = getLevel(oldScore);

    data[userId] = oldScore + amount;
    saveRizz(data);

    const newScore = data[userId];
    const newLevel = getLevel(newScore);
    const leveledUp = newLevel.level > oldLevel.level;

    return { newScore, oldLevel, newLevel, leveledUp };
}

function getRizz(userId) {
    const data = loadRizz();
    return data[userId] || 0;
}

function getRizzTitle(score) {
    return getLevel(score).title;
}

module.exports = {
    incrementRizz,
    getRizz,
    getRizzTitle,
    getLevel,
    getNextLevel,
    LEVELS,
};
