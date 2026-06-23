const { SlashCommandBuilder } = require('discord.js');
const { moviesDataChannelID } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder().setName('reset').setDescription('Resets stored movies for polls.'),
	async execute(interaction) {
		const channel = await interaction.client.channels.fetch(moviesDataChannelID);

		let deletedTotal = 0;
		let messages = await channel.messages.fetch({ limit: 100 });

		while (messages.size > 0) {
			await channel.bulkDelete(messages);
			deletedTotal += messages.size;
			messages = await channel.messages.fetch({ limit: 100 });
		}

		await interaction.reply(`Cleared ${deletedTotal} suggestion(s)!`);
	},
};