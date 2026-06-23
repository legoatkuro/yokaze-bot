const { SlashCommandBuilder } = require('discord.js');
const { moviesDataChannelID } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest').setDescription('Suggest a movie for movie night')
		.addStringOption((option) =>
			option.setName('title')
				.setDescription('The movie you want to suggest')
				.setRequired(true)),
	async execute(interaction) {
		const title = interaction.options.getString('title');

		const channel = await interaction.client.channels.fetch(moviesDataChannelID);

		const data = {
			title,
			suggestedBy: interaction.user.id,
		};

		await channel.send(JSON.stringify(data));

		await interaction.reply(`Added **${title}** to the suggestion list!`);
	},
};