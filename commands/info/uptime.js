const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { duration } = require('../../utils/functions.js');

module.exports = {
    name: 'uptime',
    category: 'info',
    usage: 'uptime',
    description: 'Gives you information on how long the Bot has been online',
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Replies with the uptime of the Bot!'),
    async execute(interaction, cfg) {
        const msg = new EmbedBuilder()
            .setColor(cfg.color2)
            .setFooter({
                text: interaction.client.user.username
            })
            .setTitle('**Uptime**')
            .setDescription(`\`\`\`${duration(interaction.client.uptime)}\`\`\``)
            .setTimestamp()
            .setImage(cfg.uptimeBanner);
        return interaction.reply({
            embeds: [msg],
            ephemeral: true
        });
    }
};
