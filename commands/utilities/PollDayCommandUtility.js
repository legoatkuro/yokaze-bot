const { SlashCommandBuilder } = require('discord.js');
const pollTracker = require('./pollTracker');
const { getDayOptions } = require('./dayOptions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pollday')
		.setDescription('Poll for which day to watch the movie'),
	async execute(interaction) {
		const options = getDayOptions();
		const answers = options.map((option) => ({ text: option.label }));

		await interaction.reply({
			poll: {
				question: { text: 'When should we watch it?' },
				answers,
				duration: 24,
				allowMultiselect: false,
			},
		});

		const sentMessage = await interaction.fetchReply();
		pollTracker.dayPoll = { channelId: sentMessage.channelId, messageId: sentMessage.id };
	},
};