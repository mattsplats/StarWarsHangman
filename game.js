'use strict';

// Allow this module to be reloaded by hotswap when changed
// ( For alexa-app server )
module.change_code = 1;

function Game () {
	this.word = newWord();
	this.wordLength = this.word.split('').reduce((a,b) => b !== ' ' ? a + 1 : a, 0)  // Length of the word, not including spaces
	this.statusArr = this.word.split('').map(a => a !== ' ' ? '_' : ' ');  // Split and replace letters with '_'
	this.guessList = [];
	this.guessCount = 0;
};

function newWord () {
	return 'big billy bo bob';
}

module.exports = Game;