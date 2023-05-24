const { Events, Collection, EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        // if user.id is not owner.id
        if (interaction.user.id !== config.ownerId) {
            return await interaction.reply({
                content: 'You are not allowed to use this bot.',
                ephemeral: true
            });
        }

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        const { cooldowns } = interaction.client;

        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const cooldownAmount = (command.cooldown ?? config.defaultCommandCooldown) * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                const message = await interaction.reply({
                    content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
                    ephemeral: true
                });

                setTimeout(() => {
                    message.delete();
                }, cooldownAmount - (now - timestamps.get(interaction.user.id)));
                return;
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        try {
            await command.execute(interaction, config, process.env);
        } catch (e) {
            console.log(String(e.stack).bgRed);
            const msg = new EmbedBuilder()
                .setColor(config.wrongColor)
                .setTitle(`❌ ERROR | An error occurred`)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
                .setFooter({
                    text: interaction.client.user.username
                })
                .setTimestamp();
            await interaction.reply({
                embeds: [msg],
                ephemeral: true
            });
        }
    }
};
