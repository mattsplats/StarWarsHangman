'use strict';

// Allow this module to be reloaded by hotswap when changed
// ( For alexa-app server )
module.change_code = 1;

const updateStatus = require('./letter.js').updateStatus;

function checkGuess (game, guess) {
	const letter = guess[0].toLowerCase();
	console.log(letter);

	if (game.guessList.indexOf(letter) !== -1) {
		return 'guessed';
	}	

	game.guessCount++;
	game.guessList.push(letter);

	if (game.word.indexOf(letter) !== -1) {
		updateStatus(game, letter);
		return true;
	}

	return false;
}

exports.checkGuess = checkGuess;