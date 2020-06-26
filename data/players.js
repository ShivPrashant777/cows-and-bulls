// Initialize player Details

const players = [];

// Join Player
const joinPlayer = (socketId, playerNumber) => {
	const player = {
		id: socketId,
		playerNumber: playerNumber,
		secretNumber: null,
		room: null,
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

// Reset State
function reset(room) {
	for(let i = 0; i < players.length; i++){
		if(players[i].room = room){
			players[i].secretNumber = null;
		}
	}
	console.log(players);
}

function opponent(player){
	let c = 0;
	let opp = null;
	for(let i = 0; i < players.length; i++){
		if(players[i].room == player.room){
			if(players[i] != player){
				opp = players[i];
			}
			else{
				continue;
			}
		}
	}
	return opp;
}

module.exports = {
	players,
	joinPlayer,
	removePlayer,
	findRemainingPlayer,
	reset,
	opponent,
};
