const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('poll').setDescription('Creates a poll deciding what movies to watch this week'),
	async execute(interaction) {
		await interaction.reply({
			poll: {
				question: { text: 'What should we watch this week?' },
				answers: [
					{ text: 'Interstellar' },
					{ text: 'Parasite' },
					{ text: 'The Matrix' },
				],
				duration: 1,
				allowMultiselect: false,
			},
		});
	},
};