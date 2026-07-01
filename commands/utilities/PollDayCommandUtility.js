const { SlashCommandBuilder } = require('discord.js');
const pollTracker = require('./PollTrackerUtility');
const { getDayOptions } = require('./DayOptions');
const { isMovieHost } = require('./HostCheckUtility');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pollday')
		.setDescription('Poll for which day to watch the movie')
		.addIntegerOption((option) =>
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
		const options = getDayOptions();
		const answers = options.map((option) => ({ text: option.label }));

		await interaction.reply({
			poll: {
				question: { text: 'When should we watch it?' },
				answers,
				duration: hours,
				allowMultiselect: true,
			},
		});

		const sentMessage = await interaction.fetchReply();
		pollTracker.dayPoll = { channelId: sentMessage.channelId, messageId: sentMessage.id };
	},
};