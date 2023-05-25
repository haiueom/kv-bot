const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    category: 'info',
    usage: 'help [Command]',
    description: 'Returns all Commmands, or one specific command',
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all commands')
        .addStringOption(option =>
            option
                .setName('command')
                .setDescription('Command name')
                .setRequired(false)
        ),
    async execute(interaction, cfg) {
        if (interaction.options.getString('command')) {
            const msg = new EmbedBuilder().setColor(cfg.color2);

            const cmd =
                interaction.client.commands.get(
                    interaction.options.getString('command').toLowerCase()
                ) ||
                interaction.client.commands.get(
                    interaction.client.aliases.get(
                        interaction.options.getString('command').toLowerCase()
                    )
                );
            if (!cmd) {
                msg.setColor(cfg.wrongColor).setDescription(
                    `No Information found for command **${cmd}**`
                );
                return interaction.reply({
                    embeds: [msg],
                    ephemeral: true
                });
            }
            if (cmd.name) {
                msg.addFields({
                    name: '**Command name**',
                    value: `\`${cmd.name}\``
                });
            }
            if (cmd.name) {
                msg.setTitle(`Detailed information about: \`${cmd.name}\``);
            }
            if (cmd.description) {
                msg.addFields({
                    name: '**Description**',
                    value: `\`${cmd.description}\``
                });
            }
            if (cmd.cooldown) {
                msg.addFields({
                    name: '**Cooldown**',
                    value: `\`${cmd.cooldown} Seconds\``
                });
            } else {
                msg.addFields({
                    name: '**Cooldown**',
                    value: `\`${cfg.defaultCommandCooldown} Seconds\``
                });
            }
            if (cmd.usage) {
                msg.addFields({ name: '**Usage**', value: `\`${cmd.usage}\`` });
                msg.setFooter({
                    text: `Syntax: <> = required, [] = optional`
                });
            }
            return interaction.reply({
                embeds: [msg],
                ephemeral: true
            });
        } else {
            const msg = new EmbedBuilder()
                .setColor(cfg.color2)
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setTitle('HELP MENU 🔰 Commands')
                .setFooter({
                    text: 'To see command descriptions and inforamtion, type: /help [CMD NAME]',
                    iconURL: interaction.client.user.displayAvatarURL()
                });

            const commands = category => {
                return interaction.client.commands
                    .filter(cmd => cmd.category === category)
                    .map(cmd => `\`${cmd.name}\``);
            };

            try {
                for (let i = 0; i < interaction.client.categories.length; i += 1) {
                    const current = interaction.client.categories[i];
                    const items = commands(current);
                    const n = 3;
                    const result = [[], [], []];
                    const wordsPerLine = Math.ceil(items.length / 3);
                    for (let line = 0; line < n; line++) {
                        for (let i = 0; i < wordsPerLine; i++) {
                            const value = items[i + line * wordsPerLine];
                            if (!value) continue;
                            result[line].push(value);
                        }
                    }
                    msg.addFields(
                        {
                            name: `**${current.toUpperCase()} [${items.length}]**`,
                            value: `> ${result[0].join('\n> ')}`,
                            inline: true
                        },
                        {
                            name: `\u200b`,
                            value: `${result[1].join('\n') ? result[1].join('\n') : '\u200b'}`,
                            inline: true
                        },
                        {
                            name: `\u200b`,
                            value: `${result[2].join('\n') ? result[2].join('\n') : '\u200b'}`,
                            inline: true
                        }
                    );
                }
            } catch (e) {
                console.log(String(e.stack));
            }

            return interaction.reply({ embeds: [msg] });
        }
    }
};
