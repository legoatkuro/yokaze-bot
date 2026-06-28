const { SlashCommandBuilder } = require('discord.js');
const pollTracker = require('./pollTracker');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pollday')
		.setDescription('Poll for which day to watch the movie'),
	async execute(interaction) {
		const today = new Date();

		const formatDate = (date) =>
			date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

		const answers = [
			{ text: `Today (${formatDate(today)})` },
		];

		for (let offset = 1; offset <= 7; offset++) {
			const date = new Date(today);
			date.setDate(date.getDate() + offset);
			const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
			answers.push({ text: `${dayName} (${formatDate(date)})` });
		}

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