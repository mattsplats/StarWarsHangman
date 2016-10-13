'use strict';

// Allow this module to be reloaded by hotswap when changed
// ( For alexa-app server )
module.change_code = 1;

const Alexa = require('alexa-app');
const app = new Alexa.app('swhangman');

const Game = require('./game.js');
const getStatus = require('./letter.js').getStatus;
const checkGuess = require('./word.js').checkGuess;

// On invocation
app.launch(function (request, response) {
	const game = new Game();
	const prompt = `Your puzzle consists of ${game.numWords} word${game.numWords > 1 ? 's' : ''}, and is ${game.puzzleLength} letters long.
		Guess a letter!`;

	response.session('game', game);
	response.say(prompt).reprompt(prompt).shouldEndSession(false);
});

// On GetStatus
app.intent('GetStatus', { "utterances": ["status", "what's my status"] }, function (request, response) {
	response.say(`You have, ${getStatus(request.session('game'))}`).shouldEndSession(false);
});

// On each guess
app.intent('GuessLetter', { "slots": {"guess": "LETTER"}, "utterances": ["{-|guess}"] }, function (request, response) {
	const guess = request.slot('guess')[0].toLowerCase();
	const game = request.session('game');

	let complete = false;

	// If Alexa doesn't register a guess value
	if (!guess) {
		response.say(`Sorry, I didn't hear a letter. Try again.`).shouldEndSession(false);

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
				response.say(`You win! ${game.puzzle.split(' ').join(', ')}, was the answer. Thanks for playing!`);
			}	else {
				response.say(`Correct! You now have: ${getStatus(game)}`);
			}

		// If the letter is not in the word, and has not been used
		} else {

			// If the player is out of guesses (ends session)
			if (game.guessesLeft <= 0) {
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

// On whole word guess
app.intent('GuessPuzzle', {"slots": {"solve": "WORD_LIST"}, "utterances": ["{is it} {-|solve}"]}, function (request, response) {
	const guess = request.slot('guess').toLowerCase();

	if (guess === game.puzzle) {
		response.say(`You win! ${game.puzzle.split(' ').join(', ')}, was the answer. Thanks for playing!`);
	}	else {
		response.say(`Sorry, you lose! The answer was, ${game.puzzle.split(' ').join(', ')}. Better luck next time. Thanks for playing!`);
	}
});

// On speed setting
app.intent('SetSpeed', {"slots": {"speed": "SPEEDS"}, "utterances": ["{talk|speed|set speed} {-|speed}"]}, function (request, response) {
	const speed = request.slot('speed').toLowerCase();
	const game = request.session('game');

	if (speed === 'faster' || speed === 'fast') {
		game.isFast = true;
		response.say(`OK. I will say the words faster.`);
	}	else if (speed === 'slower' || speed === 'slow') {
		game.isFast = false;
		response.say(`OK. I will say the words slower.`);
	} else {
		response.say(`Sorry, I didn't understand. The current talk speed is ${game.isFast ? 'fast' : 'slow'}.`);
	}

	response.reprompt(`Sorry, I didn't hear a letter. Try again.`);
	response.session('game', game);
	response.shouldEndSession(false);
});

// On 'Alexa help'
app.intent('AMAZON.HelpIntent', {}, function (request, response) {
	response.say(`Say any letter to make a guess. Words like alpha, and echo, may be used instead of letters.
		If you think you know the answer, you may say, is it, and your guess for the whole puzzle.
		Say status to get the current state of the puzzle.
		Say talk faster or talk slower to change how fast I read the puzzle blanks.
	`);
});

// On 'Alexa stop' or 'Alexa cancel'
app.intent('AMAZON.StopIntent', {}, function (request, response) {
	response.say(`Thanks for playing!`);
});
app.intent('AMAZON.CancelIntent', {}, function (request, response) {
	response.say(`Thanks for playing!`);
});

module.exports = app;

const test = new Game();
checkGuess(test, 'e');
checkGuess(test, 'a');
checkGuess(test, 'i');
checkGuess(test, 'r');
checkGuess(test, 's');
checkGuess(test, 't');
console.log(getStatus(test));