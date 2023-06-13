const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
    name: 'delete',
    category: 'worker',
    usage: 'delete <key>',
    description: 'Delete a key from the worker kv.',
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Delete a key from the worker kv.')
        .addStringOption((option) =>
            option.setName('key').setDescription('The key to delete.').setRequired(true)
        ),
    async execute(interaction, cfg, env) {
        const msg = new EmbedBuilder()
            .setColor(cfg.color2)
            .setFooter({
                text: interaction.client.user.username,
            })
            .setTimestamp();

        const key = interaction.options.getString('key');

        const { statusCode, body } = await request(cfg.kvApiEndpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-access-key': env.KV_ACCESS_KEY,
            },
            body: JSON.stringify({
                key,
            }),
        });

        msg.setTitle('**Delete**').addFields(
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
