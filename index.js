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
	response.say(`${getStatus(request.session('game'))}`).shouldEndSession(false);
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
				response.say(`You win! ${game.puzzle}, was the answer. Thanks for playing!`);
			}	else {
				response.say(`${guess}, is correct! ${game.isVerbose ? getStatus(game) : ''}`);
			}

		// If the letter is not in the word, and has not been used
		} else {

			// If the player is out of guesses (ends session)
			if (game.guessesLeft <= 0) {
				complete = true;
				response.say(`I'm sorry, the answer was, ${game.puzzle}. Thanks for playing!`);
			}	else {
				response.say(`Sorry, there's no letter ${guess}. ${game.guessesLeft} guess${game.guessesLeft > 1 ? 'es' : ''} left.`);
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
	const game = request.session('game');

	if (request.slot('solve').toLowerCase() === game.puzzle) {
		response.say(`You win! ${game.puzzle}, was the answer. Thanks for playing!`);
	}	else {
		response.say(`I'm sorry, the answer was, ${game.puzzle}. Thanks for playing!`);
	}
});

// On verbose setting
app.intent('SetVerbose', {"slots": {"verbose": "ON_OFF"}, "utterances": ["{talk|mode} {-|verbose}"]}, function (request, response) {
	const verbose = request.slot('verbose').toLowerCase();
	const game = request.session('game');

	if (verbose === 'less' || verbose === 'off') {
		game.isVerbose = false;
		response.say(`OK. Unless you say status, I won't repeat the puzzle.`);
	}	else if (verbose === 'more' || verbose === 'on') {
		game.isVerbose = true;
		response.say(`OK. I will repeat the puzzle after every guess.`);
	} else {
		response.say(`Sorry, I didn't understand. Puzzle repeat is ${game.isVerbose ? 'on' : 'off'}.`);
	}

	response.reprompt(`Guess a letter!`);
	response.session('game', game);
	response.shouldEndSession(false);
});

// On 'Alexa help'
app.intent('AMAZON.HelpIntent', {}, function (request, response) {
	response.say(`Say any letter to make a guess. Words like alpha, bravo, and echo, may be used instead of letters.
		Say: status, to get the current state of the puzzle.
		Say: talk less, and I won't repeat the puzzle on each guess, or: talk more, to enable again.
		If you think you know the answer, you can say: is it, and your guess for the whole puzzle.
	`);
	response.reprompt(`Guess a letter!`);
	response.shouldEndSession(false);
});

// On 'Alexa stop' or 'Alexa cancel'
app.intent('AMAZON.StopIntent', {}, function (request, response) {
	response.say(`Thanks for playing!`);
});
app.intent('AMAZON.CancelIntent', {}, function (request, response) {
	response.say(`Thanks for playing!`);
});

module.exports = app;

// const test = new Game();
// console.log(test.puzzle);
// checkGuess(test, 'e');
// checkGuess(test, 'a');
// checkGuess(test, 'i');
// checkGuess(test, 'r');
// checkGuess(test, 's');
// checkGuess(test, 't');
// console.log('\n' + getStatus(test));