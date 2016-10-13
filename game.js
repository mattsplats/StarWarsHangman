'use strict';

// Allow this module to be reloaded by hotswap when changed
// ( For alexa-app server )
module.change_code = 1;

const MAX_GUESSES = 8;
const WORD_LIST = [
	'jedi',
	'lightsaber',
	'blaster',
	'Darth Vader',
	'Mos Eisley',
	'ewoks',
	'Lando',
	'Luke',
	'Han Solo',
	'Obi Wan',
	'Chewbacca',
	'Death Star',
	'TATOOINE',
	'JABBA',
	'MILENNIUM FALCON',
	'Leia',
	'yoda'
];

function Game () {
	this.puzzle = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)].toLowerCase();  // Choose a word at random from WORD_LIST
	this.puzzleLength = this.puzzle.split('').reduce((a,b) => b !== ' ' ? a + 1 : a, 0)   // Length of the word, not including spaces
	this.numWords = this.puzzle.length - this.puzzleLength + 1;                           // Number of spaces + 1 = number of words
	this.statusArr = this.puzzle.split('').map(a => a !== ' ' ? '_' : ' ');               // Split and replace letters with '_'
	this.guessList = [];
	this.guessesLeft = MAX_GUESSES;
	this.isFast = false;
};

module.exports = Game;