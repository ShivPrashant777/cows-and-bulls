// Initialize player Details

const players = [];

// Join Player
const joinPlayer = (socketId, playerNumber) => {
	const player = {
		id: socketId,
		playerNumber: playerNumber,
		secretNumber: null,
	};
	players.push(player);
	return player;
};

// Remove Player
function removePlayer(id) {
	const index = players.findIndex((player) => player.id === id);
	if (index !== -1) {
		players.splice(index, 1);
	}
}

// Return Remaining player
function findRemainingPlayer() {
	return players[0];
}

module.exports = { players, joinPlayer, removePlayer, findRemainingPlayer };