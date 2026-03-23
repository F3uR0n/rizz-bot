const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/rizz.json");

// Load rizz data from disk, or start fresh
function loadRizz() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
        fs.writeFileSync(DATA_FILE, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// Save rizz data to disk
function saveRizz(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Increment rizz for a user, return new total
function incrementRizz(userId, amount = 1) {
    const data = loadRizz();
    data[userId] = (data[userId] || 0) + amount;
    saveRizz(data);
    return data[userId];
}

// Get rizz for a user
function getRizz(userId) {
    const data = loadRizz();
    return data[userId] || 0;
}

// Get a rizz title based on score
function getRizzTitle(score) {
    if (score >= 500) return "🔥 LEGENDARY RIZZLER";
    if (score >= 200) return "💅 Elite Rizz Lord";
    if (score >= 100) return "😏 Certified Rizzy";
    if (score >= 50) return "😎 Mid-Level Rizzer";
    if (score >= 20) return "🙂 Rizz Apprentice";
    return "🫠 Rizz Rookie";
}

module.exports = { incrementRizz, getRizz, getRizzTitle };
