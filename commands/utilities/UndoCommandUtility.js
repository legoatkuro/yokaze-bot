const { SlashCommandBuilder } = require('discord.js');
const { moviesDataChannelID } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder().setName('undo').setDescription('Undoes your latest suggestion.'),
	async execute(interaction) {
		const channel = await interaction.client.channels.fetch(moviesDataChannelID);

		const messages = await channel.messages.fetch({ limit: 100 });

		const userMsg = messages.find((message) => {
			const data = JSON.parse(message.content);

			return data.suggestedBy === interaction.user.id;
		});

		if (!userMsg) {
			await interaction.reply('couldn\'t find suggestion to undo.');

			return;
		}

		const data = JSON.parse(userMsg.content);
		await userMsg.delete();

		await interaction.reply(`Removed your suggestion: **${data.title}**`);
	},
};