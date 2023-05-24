const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
    name: 'read',
    category: 'worker',
    usage: 'read [key]',
    description: 'Listing keys or get value from a key.',
    data: new SlashCommandBuilder()
        .setName('read')
        .setDescription('Listing keys or get value from a key.')
        .addStringOption(option => option.setName('key').setDescription('The key to read.')),
    async execute(interaction, cfg, env) {
        const msg = new EmbedBuilder()
            .setColor(cfg.color2)
            .setFooter({
                text: interaction.client.user.username
            })
            .setTimestamp();

        const key = interaction.options.getString('key');

        if (key) {
            const { statusCode, body } = await request(`${cfg.kvApiEndpoint}/${key}`, {
                method: 'GET',
                headers: {
                    'x-access-key': env.KV_ACCESS_KEY
                }
            });

            msg.setTitle('**Read KV**').addFields(
                {
                    name: '**Status Code**',
                    value: `\`${statusCode}\``
                },
                {
                    name: '**Body JSON**',
                    value: `\`\`\`${JSON.stringify(await body.json(), null, 2)}\`\`\``
                }
            );

            return await interaction.reply({
                embeds: [msg],
                ephemeral: true
            });
        }

        const { statusCode, body } = await request(cfg.kvApiEndpoint, {
            method: 'GET',
            headers: {
                'x-access-key': env.KV_ACCESS_KEY
            }
        });

        msg.setTitle('**Read All Keys**').addFields(
            {
                name: '**Status Code**',
                value: `\`${statusCode}\``
            },
            {
                name: '**Body JSON**',
                value: `\`\`\`${JSON.stringify(await body.json(), null, 2)}\`\`\``
            }
        );

        return await interaction.reply({
            embeds: [msg],
            ephemeral: true
        });
    }
};
