const { SlashCommandBuilder } = require('discord.js');
const { moviesDataChannelID, tmdbToken } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Suggest a movie for movie night')
		.addStringOption((option) =>
			option.setName('title')
				.setDescription('The movie you want to suggest')
				.setRequired(true)),
	async execute(interaction) {
		const title = interaction.options.getString('title');

		const response = await fetch(
			`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}`,
			{
				headers: { Authorization: `Bearer ${tmdbToken}` },
			},
		);
		const data = await response.json();
		const movie = data.results[0];

		if (!movie) {
			await interaction.reply(`Couldn't find a movie called "${title}" on TMDB.`);
			return;
		}

		const channel = await interaction.client.channels.fetch(moviesDataChannelID);

		const storedData = {
			suggestedBy: interaction.user.id,
			...movie,
		};

		await channel.send(JSON.stringify(storedData));

		await interaction.reply(`Found: **${movie.title}** (${movie.release_date?.slice(0, 4)})\n${movie.overview}\n\nAdded to the suggestion list!`);
	},
};