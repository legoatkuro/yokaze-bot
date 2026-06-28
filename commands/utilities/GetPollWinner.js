async function getPollWinner(client, pollInfo) {
	if (!pollInfo) return null;

	const channel = await client.channels.fetch(pollInfo.channelId);
	const message = await channel.messages.fetch(pollInfo.messageId);

	if (!message.poll) return null;

	let winner = null;
	for (const answer of message.poll.answers.values()) {
		if (!winner || answer.voteCount > winner.voteCount) {
			winner = answer;
		}
	}

	return winner ? winner.text : null;
}

module.exports = { getPollWinner };