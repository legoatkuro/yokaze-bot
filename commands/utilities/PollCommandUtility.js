const { SlashCommandBuilder } = require('discord.js');
const { moviesDataChannelID } = require('../../config.json');
const DISCORD_POLL_LIMIT = 10;
const pollTracker = require('./PollTrackerUtility');
const { isMovieHost } = require('./HostCheckUtility');

module.exports = {
	data: new SlashCommandBuilder().setName('poll').setDescription('Creates a poll deciding what movies to watch this week').addIntegerOption((option) =>
		option.setName('hours')
			.setDescription('How many hours the poll stays open (default 24)')
			.setMinValue(1)
			.setMaxValue(768)),
	async execute(interaction) {

		if (!isMovieHost(interaction)) {
	        await interaction.reply({ content: 'Only a Movie Host can use this.', ephemeral: true });

	        return;
		}

		const hours = interaction.options.getInteger('hours') ?? 24;
		const channel = await interaction.client.channels.fetch(moviesDataChannelID);
		const messages = await channel.messages.fetch({ limit: DISCORD_POLL_LIMIT });

		const titles = messages.map((message) => {
			const data = JSON.parse(message.content);
			return data.title;
		});

        		const answers = titles.map((title) => ({ text: title }));

		await interaction.reply({
			poll: {
				question: { text: 'What should we watch this week?' },
				answers,
				duration: hours,
				allowMultiselect: true,
			},
		});

		const sentMessage = await interaction.fetchReply();
		pollTracker.moviePoll = { channelId: sentMessage.channelId, messageId: sentMessage.id };
	},
};