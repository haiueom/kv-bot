const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
    name: 'create',
    category: 'worker',
    usage: 'create <key> <value>',
    description: 'Create a new key-value pairs to the worker kv.',
    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('Create a new key-value pairs to the worker kv.')
        .addStringOption(option =>
            option
                .setName('key')
                .setDescription('The key to add.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('value')
                .setDescription('The value to add.')
                .setRequired(true)
        ),
    async execute(interaction, cfg, env) {
        const msg = new EmbedBuilder()
            .setColor(cfg.color2)
            .setFooter({
                text: interaction.client.user.username
            })
            .setTimestamp();

        const key = interaction.options.getString('key', true);
        const value = interaction.options.getString('value', true);

        const { statusCode, body } = await request(cfg.kvApiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-key': env.KV_ACCESS_KEY
            },
            body: JSON.stringify({
                key,
                value
            })
        });

        msg.setTitle('**Create New**').addFields(
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
