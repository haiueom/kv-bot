const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
    name: 'update',
    category: 'worker',
    usage: 'update <key> <value>',
    description: 'Update a key-value pairs.',
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Update a key-value pairs.')
        .addStringOption((option) =>
            option.setName('key').setDescription('The key to add.').setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('value').setDescription('The value to add.').setRequired(true)
        ),
    async execute(interaction, cfg, env) {
        const msg = new EmbedBuilder()
            .setColor(cfg.color2)
            .setFooter({
                text: interaction.client.user.username,
            })
            .setTimestamp();

        const key = interaction.options.getString('key', true);
        const value = interaction.options.getString('value', true);

        const { statusCode, body } = await request(cfg.kvApiEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-key': env.KV_ACCESS_KEY,
            },
            body: JSON.stringify({
                key,
                value,
            }),
        });

        msg.setTitle('**Create New**').addFields(
            {
                name: '**Status Code**',
                value: `\`${statusCode}\``,
            },
            {
                name: '**Body JSON**',
                value: `\`\`\`${JSON.stringify(await body.json(), null, 2)}\`\`\``,
            }
        );

        return await interaction.reply({
            embeds: [msg],
            ephemeral: true,
        });
    },
};
