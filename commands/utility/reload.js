const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'reload',
    category: 'utility',
    usage: 'reload <command>',
    description: 'Reloads a command',
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command.')
        .addStringOption((option) =>
            option.setName('command').setDescription('The command to reload.').setRequired(true)
        ),
    async execute(interaction, cfg) {
        const commandName = interaction.options.getString('command', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply({
                content: `There is no command with name \`${commandName}\`!`,
                ephemeral: true,
            });
        }

        delete require.cache[require.resolve(`../${command.category}/${command.data.name}.js`)];

        interaction.client.commands.delete(command.data.name);

        const newCommand = require(`../${command.category}/${command.data.name}.js`);

        interaction.client.commands.set(newCommand.data.name, newCommand);

        const msg = new EmbedBuilder()
            .setColor(cfg.color2)
            .setFooter({
                text: interaction.client.user.username,
            })
            .setTitle('**Reload**')
            .setDescription(`\`\`\`${command.data.name} was reloaded!\`\`\``)
            .setTimestamp()
            .setImage(cfg.reloadBanner);
        return interaction.reply({
            embeds: [msg],
            ephemeral: true,
        });
    },
};
