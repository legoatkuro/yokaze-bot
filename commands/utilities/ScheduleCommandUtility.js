const { SlashCommandBuilder, ChannelType, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } = require('discord.js');
const { moviesDataChannelID } = require('../../config.json');
const pollTracker = require('./PollTrackerUtility');
const { getPollWinner } = require('./GetPollWinner');
const { getDayOptions } = require('./DayOptions');
const { isMovieHost } = require('./HostCheckUtility');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createevent')
		.setDescription('Creates a movie night event from a suggestion')
		.addStringOption((option) =>
			option.setName('movie')
				.setDescription('Pick from current suggestions')
				.setAutocomplete(true)
				.setRequired(true))
		.addStringOption((option) =>
			option.setName('day')
				.setDescription('Which day (or type YYYY-MM-DD manually)')
				.setAutocomplete(true)
				.setRequired(true)),
	async autocomplete(interaction) {
		const focused = interaction.options.getFocused(true);

		if (focused.name === 'day') {
			const options = getDayOptions();
			const winnerText = await getPollWinner(interaction.client, pollTracker.dayPoll);

			const winnerOption = options.find((option) => option.label === winnerText);

			let orderedOptions = options;
			if (winnerOption) {
				orderedOptions = [winnerOption, ...options.filter((option) => option !== winnerOption)];
			}

			await interaction.respond(
				orderedOptions.map((option) => ({
					name: option === winnerOption ? `⭐ ${option.label} (poll winner)` : option.label,
					value: option.value,
				})),
			);
			return;
		}

		if (focused.name === 'movie') {
			const typed = focused.value;

			const moviesChannel = await interaction.client.channels.fetch(moviesDataChannelID);
			const messages = await moviesChannel.messages.fetch({ limit: 100 });
			const titles = messages.map((message) => JSON.parse(message.content).title);

			const winnerTitle = await getPollWinner(interaction.client, pollTracker.moviePoll);

			let orderedTitles = titles;
			if (winnerTitle && titles.includes(winnerTitle)) {
				orderedTitles = [winnerTitle, ...titles.filter((title) => title !== winnerTitle)];
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
	        await interaction.reply({ content: 'Only a Movie Host can use this.', ephemeral: true });

	        return;
		}

		const title = interaction.options.getString('movie');
		const dayValue = interaction.options.getString('day');

		if (dayValue === 'other') {
			await interaction.reply('Type an actual date instead of picking "Other / Later" — format: YYYY-MM-DD (e.g. 2026-07-05).');
			return;
		}

		const startTime = new Date(`${dayValue}T21:00:00`);
		if (isNaN(startTime.getTime())) {
			await interaction.reply('That date didn\'t parse right. Use format YYYY-MM-DD, e.g. 2026-07-05.');
			return;
		}

		const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);

		const channel = interaction.guild.channels.cache.find(
			(c) => c.name === 'General' && c.type === ChannelType.GuildVoice,
		);

		if (!channel) {
			await interaction.reply('Couldn\'t find a voice channel called "General".');
			return;
		}

		const moviesChannel = await interaction.client.channels.fetch(moviesDataChannelID);
		const messages = await moviesChannel.messages.fetch({ limit: 100 });

		const match = messages.find((message) => {
			const data = JSON.parse(message.content);
			return data.title.toLowerCase() === title.toLowerCase();
		});

		if (!match) {
			await interaction.reply(`Couldn't find a suggestion called "${title}".`);
			return;
		}

		const movie = JSON.parse(match.content);

		let posterBuffer;
		if (movie.poster_path) {
			const posterResponse = await fetch(`https://image.tmdb.org/t/p/w500${movie.poster_path}`);
			posterBuffer = Buffer.from(await posterResponse.arrayBuffer());
		}

		await interaction.guild.scheduledEvents.create({
			name: `Movie Night: ${movie.title}`,
			scheduledStartTime: startTime,
			scheduledEndTime: endTime,
			privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
			entityType: GuildScheduledEventEntityType.Voice,
			channel: channel.id,
			description: movie.overview,
			image: posterBuffer,
		});

		await interaction.channel.send({
			content: `@everyone Movie night is set! We're watching **${movie.title}** on <t:${Math.floor(startTime.getTime() / 1000)}:F>`,
			allowedMentions: { parse: ['everyone'] },
		});

		await interaction.reply(`Event created for **${movie.title}**!`);
	},
};