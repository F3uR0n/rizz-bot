module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log(`✅ TrollerBot is online as ${client.user.tag}`);
        client.user.setActivity("👀 watching you cook...", { type: 3 }); // type 3 = WATCHING
    },
};
