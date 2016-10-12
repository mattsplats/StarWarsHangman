'use strict';

const Alexa = require('alexa-app');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app
const APP = new Alexa.app('swhangman');

// On invocation
APP.launch(function(request, response) {
	const prompt = 'Guess a letter!';
	const word = 'hut';
	const status = '___';

	response.session('word', word);
	response.session('status', status);
	response.session('guessCount', 0);

	response.say(prompt).reprompt(prompt).shouldEndSession(false);
});

// On GetStatus
APP.intent('GetStatus', { "utterances": ["status", "what's my status"] }, function(request, response) {
	let status = request.session('status').split('').join(', ').replace(/(_)/g, 'blank');
	console.log(status);
	response.say(`You have, ${status}`).shouldEndSession(false);
});

// On each guess
APP.intent('GuessLetter', { "slots": {"guess": "LITERAL"}, "utterances": ["{word}"] }, function(request, response) {
	const guess = request.slot('guess');
	const word = request.session('word');
	let status = request.session('status')
	const guessCount = (+request.session('guessCount')) + 1;

	console.log(guess, word, status, guessCount);

	if (!guess) {
		response.say(`Sorry, I didn't hear a letter. The word was ${word}`);

	} else {
		const index = word.indexOf(guess[0]);
		console.log(index);

		if (index !== -1) {
			console.log('hit');
			status = status.slice(0, index) + word[index] + status.slice(index + 1);
			response.say('Correct!');
		} else {
			console.log('miss');
			response.say('Guess again');
		}
	
		if (status === word) {
			console.log('win');
			response.say(`You finished the word ${word}. Thanks for playing!`);
		} else {
			response.reprompt("Sorry, I didn't hear a letter. Try again.");
			response.session('status', status);
			response.session('guessCount', guessCount);
			response.shouldEndSession(false);
		}
	}
});

module.exports = APP;