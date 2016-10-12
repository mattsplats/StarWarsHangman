'use strict';

// Allow this module to be reloaded by hotswap when changed
// ( For alexa-app server )
module.change_code = 1;

function getStatus (game) {
	return game.statusArr.join(', ').replace(/(_)/g, 'blank');
}

function updateStatus (game, guess) {
	for (let i = 0; i < game.word.length; i++) {
		if (game.word[i] === guess) game.statusArr[i] = game.word[i];
	}
}

exports.getStatus = getStatus;
exports.updateStatus = updateStatus;