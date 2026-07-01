const { SlashCommandBuilder } = require('discord.js');
const { moviesDataChannelID } = require('../../config.json');
const DISCORD_POLL_LIMIT = 10;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('read')
		.setDescription('Reads out all suggestions made by members'),

	async execute(interaction) {
		const channel = await interaction.client.channels.fetch(moviesDataChannelID);
		const messages = await channel.messages.fetch({ limit: DISCORD_POLL_LIMIT });

		if (messages.size === 0) {
			await interaction.reply('No suggestions yet. use /suggest to add one!');

			return;
		}

		const list = messages.map((message) => {
			const data = JSON.parse(message.content);
			const year = data.release_date?.slice(0, 4) ?? 'unknown';

			return `• ${data.title} (${year})`;
		});

		await interaction.reply(list.join('\n'));
	},
};