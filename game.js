'use strict';

// Allow this module to be reloaded by hotswap when changed
// ( For alexa-app server )
module.change_code = 1;

function Game (puzzle, guesses) {
	this.puzzle = puzzle;
	this.puzzleLength = this.puzzle.split('').reduce((a,b) => b !== ' ' ? a + 1 : a, 0)  // Length of the word, not including spaces
	this.numWords = this.puzzle.length - this.puzzleLength + 1;                          // Number of spaces + 1 = number of words
	this.statusArr = this.puzzle.split('').map(a => a !== ' ' ? '_' : ' ');              // Split and replace letters with '_'
	this.guessList = [];
	this.guessesLeft = guesses;
};

module.exports = Game;