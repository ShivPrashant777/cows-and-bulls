const socket = io();
const form = document.getElementById('form');
const inputNumber = document.getElementById('inputNumber');

// Force Disconnect User
socket.on('disconnectUser', function () {
	socket.disconnect();
	window.location.href = '/index.html';
	alert('2 Players Already Connected');
});

socket.on('getMove', function () {
	console.log('getMove Called');
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		const move = inputNumber.value;
		console.log(move);

		// Send Move To Server
		socket.emit('sendMove', { move: move });
		inputNumber.value = '';
	});
});
