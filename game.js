'use strict';

// Allow this module to be reloaded by hotswap when changed
// ( For alexa-app server )
module.change_code = 1;

function Game () {
	this.word = newWord();
	this.statusArr = [];
	this.guessList = [];
	this.guessCount = 0;

	// Creates array of blank letters
	for (const letter of this.word) this.statusArr.push('_');
};

function newWord () {
	return 'bubba';
}

module.exports = Game;