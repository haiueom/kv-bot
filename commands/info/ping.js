const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    category: 'info',
    usage: 'ping',
    description: 'Gives you information on how fast the Bot can respond to you',
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    async execute(interaction, cfg) {
        const msg = new EmbedBuilder()
            .setColor(cfg.color2)
            .setFooter({
                text: interaction.client.user.username,
            })
            .setTitle('**Pong!**')
            .setDescription(`\`\`\`${Math.round(interaction.client.ws.ping)}ms\`\`\``)
            .setTimestamp()
            .setImage(cfg.pingBanner);
        return interaction.reply({
            embeds: [msg],
            ephemeral: true,
        });
    },
};
