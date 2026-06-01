const fs = require("fs");
const path = require("path");

const PROFILES_FILE = path.join(__dirname, "../data/userProfiles.json");

function loadProfiles() {
    if (!fs.existsSync(PROFILES_FILE)) {
        fs.writeFileSync(PROFILES_FILE, JSON.stringify({}, null, 2));
        return {};
    }
    try {
        return JSON.parse(fs.readFileSync(PROFILES_FILE, "utf8"));
    } catch {
        return {};
    }
}

function getProfile(userId) {
    const profiles = loadProfiles();
    return profiles[String(userId)] || null;
}

function saveProfile(profile) {
    const profiles = loadProfiles();
    profiles[String(profile.userId)] = profile;
    fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2));
}

module.exports = { getProfile, saveProfile, loadProfiles };
