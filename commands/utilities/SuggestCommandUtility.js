const { SlashCommandBuilder } = require('discord.js');
const { moviesDataChannelID, tmdbToken } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Suggest a movie for movie night')
		.addStringOption((option) =>
			option.setName('title')
				.setDescription('The movie you want to suggest')
				.setAutocomplete(true)
				.setRequired(true)),
	async autocomplete(interaction) {
		const typed = interaction.options.getFocused();

		if (!typed) {
			await interaction.respond([]);
			return;
		}

		const response = await fetch(
			`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(typed)}`,
			{ headers: { Authorization: `Bearer ${tmdbToken}` } },
		);
		const data = await response.json();

		const choices = data.results.slice(0, 25).map((movie) => ({
			name: `${movie.title} (${movie.release_date?.slice(0, 4) ?? 'unknown year'})`,
			value: String(movie.id),
		}));

		await interaction.respond(choices);
	},
	async execute(interaction) {
		await interaction.deferReply();

		const channel = await interaction.client.channels.fetch(moviesDataChannelID);
		const existingMessages = await channel.messages.fetch({ limit: 10 });

		if (existingMessages.size >= 10) {
			await interaction.editReply('There are already 10 suggestions — run /poll, or have a Movie Host use /reset before suggesting more.');
			return;
		}

		const input = interaction.options.getString('title');
		const isExactId = /^\d+$/.test(input);

		const url = isExactId
			? `https://api.themoviedb.org/3/movie/${input}`
			: `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(input)}`;

		const response = await fetch(url, { headers: { Authorization: `Bearer ${tmdbToken}` } });
		const data = await response.json();
		const movie = isExactId ? data : data.results[0];

		if (!movie || movie.success === false) {
			await interaction.editReply(`Couldn't find a movie called "${input}" on TMDB.`);
			return;
		}

		const alreadySuggested = existingMessages.some((message) => {
			const existingMovie = JSON.parse(message.content);
			return existingMovie.id === movie.id;
		});

		if (alreadySuggested) {
			await interaction.editReply(`**${movie.title}** has already been suggested.`);
			return;
		}

		const storedData = {
			suggestedBy: interaction.user.id,
			...movie,
		};

		await channel.send(JSON.stringify(storedData));

		await interaction.editReply(`Found: **${movie.title}** (${movie.release_date?.slice(0, 4)})\n${movie.overview}\n\nAdded to the suggestion list!`);
	},
};