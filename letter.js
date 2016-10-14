'use strict';

// Allow this module to be reloaded by hotswap when changed
// ( For alexa-app server )
module.change_code = 1;

function getStatus (game) {
	const originalStr = game.statusArr.slice().join('');
	let wordArr = originalStr.split(' ');

	for (let i = 0; i < wordArr.length; i++) {
		wordArr[i] = wordArr[i].split('').map(a => {
			let result = ` ${a},`;
			if (a === '_') result = ' blank';
			return result;
		}).join('');
		console.log(wordArr[i] + '\n');
	}

	// for (let i = 0; i < wordArr.length; i++) {
	// 	wordArr[i] = wordArr[i].split('').map(a => a === '_' ? 'blank' : a)                // Replace all underscores with the word 'blank' 
	// 		.map(a => a === ' ' ? `<break time='100ms'/>space` : `<break time='1ms'/>${a}`)  // Replace all spaces with the word 'space' and add breaks
	// 		.join('');
	// 	console.log(wordArr[i] + '\n');
	// }

	let output = `First word: ${wordArr[0]}`;
	if (wordArr.length > 1) output += `. Second word: ${wordArr[1]}`;

	return output;
}

function updateStatus (game, guess) {
	for (let i = 0; i < game.puzzle.length; i++) {
		if (game.puzzle[i] === guess) game.statusArr[i] = game.puzzle[i];
	}
}

exports.getStatus = getStatus;
exports.updateStatus = updateStatus;