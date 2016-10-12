'use strict';

// Allow this module to be reloaded by hotswap when changed
// ( For alexa-app server )
module.change_code = 1;

const Alexa = require('alexa-app');
const Game = require('./game.js');
const getStatus = require('./letter.js').getStatus;
const checkGuess = require('./word.js').checkGuess;

const APP = new Alexa.app('swhangman');

// On invocation
APP.launch(function(request, response) {
	const game = new Game;
	const prompt = `Your word is, ${game.word.length}, letters long. Guess a letter!`;

	response.session('game', game);
	response.say(prompt).reprompt(prompt).shouldEndSession(false);
});

// On GetStatus
APP.intent('GetStatus', { "utterances": ["status", "what's my status"] }, function(request, response) {
	const game = request.session('game');
	console.log(getStatus(game));

	response.say(`You have, ${getStatus(game)}`).shouldEndSession(false);
});

// On each guess
APP.intent('GuessLetter', { "slots": {"guess": "LETTER"}, "utterances": ["{-|guess}"] }, function(request, response) {
	const guess = request.slot('guess')[0];
	const game = request.session('game');

	let complete = false;

	console.log(guess);

	// If Alexa doesn't register a guess value
	if (!guess) {
		response.say(`Sorry, I didn't hear a letter. The word was, ${game.word}`);

	// If Alexa registers a guess value
	} else {
		const result = checkGuess(game, guess);

		// If the player has already used this letter
		if (result === 'guessed') {
			response.say(`You already tried ${guess}. Guess again`);

		// If the letter is in the word, and has not been used
		} else if (result) {

			// If the word is complete (ends session)
			if (game.statusArr.join('') === game.word) {
				complete = true;
				response.say(`You win! The complete word is, ${game.word}. You used ${game.guessCount} guesses. Thanks for playing!`);
			}	else {
				response.say(`Correct! You now have, ${getStatus(game)}`);
			}

		// If the letter is not in the word, and has not been used
		} else {
			response.say(`Sorry, ${guess} is not part of the word. Guess again`);
		}
	
		// If the word is not complete (prevents session from ending)
		if (!complete) {
			const reprompt = `Sorry, I didn't hear a letter. Try again.`;

			response.reprompt(reprompt).reprompt(reprompt);
			response.session('game', game);
			response.shouldEndSession(false);
		}
	}
});

module.exports = APP;

// const testGame = new Game;
// console.log(testgetStatus(game) + '\n');

// console.log(testGame.checkGuess('h'));
// console.log(testGame.guessCount);
// console.log(testgetStatus(game));
// console.log(testGame.guessList + '\n');

// console.log(testGame.checkGuess('h'));
// console.log(testGame.guessCount);
// console.log(testgetStatus(game));
// console.log(testGame.guessList + '\n');

// console.log(testGame.checkGuess('u'));
// console.log(testGame.guessCount);
// console.log(testgetStatus(game));
// console.log(testGame.guessList + '\n');

// console.log(testGame.checkGuess('t'));
// console.log(testGame.guessCount);
// console.log(testGame.status());
// console.log(testGame.guessList + '\n');