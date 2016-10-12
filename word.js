'use strict';

// Allow this module to be reloaded by hotswap when changed
// ( For alexa-app server )
module.change_code = 1;

const updateStatus = require('./letter.js').updateStatus;

function checkGuess (game, guess) {
	if (game.guessList.indexOf(guess) !== -1) {
		return 'guessed';
	}	

	game.guessesLeft--;
	game.guessList.push(guess);

	if (game.puzzle.indexOf(guess) !== -1) {
		updateStatus(game, guess);
		return true;
	}

	return false;
}

exports.checkGuess = checkGuess;