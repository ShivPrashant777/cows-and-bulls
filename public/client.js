const socket = io('http://localhost:5000');
const form = document.getElementById('form');
const inputNumber = document.getElementById('inputNumber');

socket.on('msg', (data) => {
	console.log(data);
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
