const { SlashCommandBuilder } = require('discord.js');
const { moviesDataChannelID } = require('../../config.json');
const pollTracker = require('./PollTrackerUtility');
const { getPollWinner } = require('./GetPollWinner');
const { isMovieHost } = require('./HostCheckUtility');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('deletes a singular suggestion from the suggestion list.')
		.addStringOption((option) =>
			option
				.setName('movie')
				.setDescription('Pick from current suggestions')
				.setAutocomplete(true)
				.setRequired(true),
		),

	async autocomplete(interaction) {
		const focused = interaction.options.getFocused(true);

		if (focused.name === 'movie') {
			const typed = focused.value;

			const moviesChannel =
        await interaction.client.channels.fetch(moviesDataChannelID);
			const messages = await moviesChannel.messages.fetch({ limit: 100 });
			const titles = messages.map(
				(message) => JSON.parse(message.content).title,
			);

			const winnerTitle = await getPollWinner(
				interaction.client,
				pollTracker.moviePoll,
			);

			let orderedTitles = titles;
			if (winnerTitle && titles.includes(winnerTitle)) {
				orderedTitles = [
					winnerTitle,
					...titles.filter((title) => title !== winnerTitle),
				];
			}

			const matches = orderedTitles
				.filter((title) => title.toLowerCase().includes(typed.toLowerCase()))
				.slice(0, 25);

			await interaction.respond(
				matches.map((title) => ({
					name: title === winnerTitle ? `⭐ ${title} (poll winner)` : title,
					value: title,
				})),
			);
		}
	},

	async execute(interaction) {
		if (!isMovieHost(interaction)) {
			await interaction.reply({
				content: 'Only a Movie Host can use this.',
				ephemeral: true,
			});

			return;
		}

		await interaction.deferReply();

		const title = interaction.options.getString('movie');

		const moviesChannel =
      await interaction.client.channels.fetch(moviesDataChannelID);
		const messages = await moviesChannel.messages.fetch({ limit: 100 });

		const match = messages.find((message) => {
			const data = JSON.parse(message.content);
			return data.title.toLowerCase() === title.toLowerCase();
		});

		if (!match) {
			await interaction.editReply(
				`Couldn't find a suggestion called "${title}".`,
			);
			return;
		}

		const movie = JSON.parse(match.content);
		await match.delete();

		await interaction.editReply(
			`Removed **${movie.title}** from the suggestion list.`,
		);
	},
};
