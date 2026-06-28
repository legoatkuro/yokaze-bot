function isMovieHost(interaction) {
	return interaction.member.roles.cache.some((role) => role.name === 'Movie Host');
}

module.exports = { isMovieHost };