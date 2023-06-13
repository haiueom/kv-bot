const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        // reset activity after 1 hour
        setInterval(() => {
            client.user.setActivity({
                name: `${client.guilds.cache.size} servers`,
                type: ActivityType.Watching,
            });
        }, 3600000);
    },
};
