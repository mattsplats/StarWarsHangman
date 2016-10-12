'use strict';

// Allow this module to be reloaded by hotswap when changed
// ( For alexa-app server )
module.change_code = 1;

const Alexa = require('alexa-app');
const Tabletop = require('tabletop');

const Game = require('./game.js');
const getStatus = require('./letter.js').getStatus;
const checkGuess = require('./word.js').checkGuess;

const APP = new Alexa.app('swhangman');
const MAX_GUESSES = 3;

// On invocation
APP.launch(function (request, response) {
	Tabletop.init({
		key: "https://docs.google.com/spreadsheets/d/1t91WBYfhh9FKVT2IRz8G_1cx8G1EkyfFQlk-AMPFwcQ/pubhtml",
		callback: launch,
		simpleSheet: true
	});

	function launch (data) {
		const game = new Game(data[Math.floor(Math.random() * data.length)].word.toLowerCase(), MAX_GUESSES);
		const prompt = `Your puzzle consists of ${game.numWords} words, and is ${game.puzzleLength} letters long. Guess a letter!`;

		response.session('game', game);
		response.say(prompt).reprompt(prompt).shouldEndSession(false).send();
	}

	// Async handlers in alexa-app must return false to prevent sending a default response
	return false;
});

// On GetStatus
APP.intent('GetStatus', { "utterances": ["status", "what's my status"] }, function (request, response) {
	response.say(`You have, ${getStatus(request.session('game'))}`).shouldEndSession(false);
});

// On each guess
APP.intent('GuessLetter', { "slots": {"guess": "LETTER"}, "utterances": ["{-|guess}"] }, function (request, response) {
	const guess = request.slot('guess')[0].toLowerCase();
	const game = request.session('game');

	let complete = false;

	// If Alexa doesn't register a guess value
	if (!guess) {
		response.say(`Sorry, I didn't hear a letter.`);

	// If Alexa registers a guess value
	} else {
		const result = checkGuess(game, guess);

		// If the player has already used this letter
		if (result === 'guessed') {
			response.say(`You've already used the letter ${guess}, guess again.`);

		// If the letter is in the word, and has not been used
		} else if (result) {

			// If the word is complete (ends session)
			if (game.statusArr.join('') === game.puzzle) {
				complete = true;
				response.say(`You win! The completed puzzle is, ${game.puzzle.split(' ').join(', ')}. Thanks for playing!`);
			}	else {
				response.say(`Correct! You now have, ${getStatus(game)}`);
			}

		// If the letter is not in the word, and has not been used
		} else {

			// If the player is out of guesses (ends session)
			if (game.guessesLeft >= 0) {
				complete = true;
				response.say(`Sorry, you lose! The answer was, ${game.puzzle.split(' ').join(', ')}. Better luck next time. Thanks for playing!`);
			}	else {
				response.say(`Sorry, the letter ${guess} is not part of the puzzle. You have ${game.guessesLeft} guesses left.`);
			}
		}
	
		// If the word is not complete (prevents session from ending)
		if (!complete) {
			response.reprompt(`Sorry, I didn't hear a letter. Try again.`);
			response.session('game', game);
			response.shouldEndSession(false);
		}
	}
});

// On 'Alexa stop' or 'Alexa cancel'
APP.intent('AMAZON.StopIntent', {}, function (request, response) {
	response.say(`Thanks for playing!`);
});
APP.intent('AMAZON.CancelIntent', {}, function (request, response) {
	response.say(`Thanks for playing!`);
});

module.exports = APP;

// const testGame = new Game('test pest best', 2);
// console.log(testGame);
// let result = checkGuess(testGame, 'y');
// console.log(result);
// console.log(testGame);
// result = checkGuess(testGame, 'x');
// console.log(result);
// console.log(testGame);